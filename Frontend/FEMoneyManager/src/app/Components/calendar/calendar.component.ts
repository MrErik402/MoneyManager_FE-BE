import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ApiService } from '../../Services/api.service';
import { SessionService } from '../../Services/session.service';
import { Transaction } from '../../Interfaces/Transaction';
import { Category } from '../../Interfaces/Category';
import { Wallet } from '../../Interfaces/Wallet';
import { from, forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    events: [],
    eventColor: '#3788d8',
    eventTextColor: '#fff',
    height: 'auto',
    eventDidMount: (info) => {
      // Add tooltip on hover
      if (info.event.extendedProps && info.event.extendedProps['tooltip']) {
        const tooltip = info.event.extendedProps['tooltip'] as string;
        if (info.el) {
          info.el.setAttribute('title', tooltip);
        }
      }
    }
  };
  
  baseUrl = 'http://localhost:3000';
  transactions: Transaction[] = [];
  categories: Category[] = [];
  wallets: Wallet[] = [];
  loading = false;

  constructor(
    private api: ApiService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('id');
    const user = this.sessionService.getUser();
    
    // Always redirect to logged-in user's ID if user is logged in
    if (user) {
      if (!routeId || routeId !== user.id) {
        // Redirect to the logged-in user's ID
        this.router.navigate(['/calendar', user.id], { replaceUrl: true });
        return;
      }
      // User is logged in and ID matches, proceed
      this.loadData();
      this.checkDarkMode();
    } else {
      // No user logged in, but still try to load (might be handled by auth guard)
      this.loadData();
      this.checkDarkMode();
    }
  }

  loadData() {
    this.loading = true;
    
    // Load transactions, categories, and wallets in parallel
    forkJoin({
      transactions: from(this.api.getAll(`${this.baseUrl}/transactions`)),
      categories: from(this.api.getAll(`${this.baseUrl}/categories`)),
      wallets: from(this.api.getAll(`${this.baseUrl}/wallets`))
    }).subscribe({
      next: (responses: any) => {
        // Handle transactions - axios wraps in response.data
        this.transactions = Array.isArray(responses.transactions?.data) 
          ? responses.transactions.data 
          : (Array.isArray(responses.transactions) ? responses.transactions : []);
        
        // Handle categories
        this.categories = Array.isArray(responses.categories?.data) 
          ? responses.categories.data 
          : (Array.isArray(responses.categories) ? responses.categories : []);
        
        // Handle wallets
        this.wallets = Array.isArray(responses.wallets?.data) 
          ? responses.wallets.data 
          : (Array.isArray(responses.wallets) ? responses.wallets : []);
        
        this.updateCalendarEvents();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  }

  getWalletName(walletId: string): string {
    const wallet = this.wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'N/A';
  }

  updateCalendarEvents() {
    const events: EventInput[] = [];
    
    this.transactions.forEach((transaction: any) => {
      // Use date field if available, otherwise use nextRecurrenceDate for recurring transactions
      // If neither exists, skip this transaction
      let eventDate: Date | null = null;
      
      if (transaction.date) {
        eventDate = new Date(transaction.date);
      } else if (transaction.isRecurring && transaction.nextRecurrenceDate) {
        eventDate = new Date(transaction.nextRecurrenceDate);
      }
      
      // Only add event if we have a valid date
      if (eventDate && !isNaN(eventDate.getTime())) {
        const color = transaction.type === 'bevétel' ? '#10b981' : '#ef4444'; // green for income, red for expense
        const categoryName = this.getCategoryName(transaction.categoryID);
        const walletName = this.getWalletName(transaction.walletID);
        const typeText = transaction.type === 'bevétel' ? 'Bevétel' : 'Kiadás';
        
        // Title: only the amount (no time)
        const title = `${transaction.type === 'bevétel' ? '+' : '-'}${transaction.amount} Ft`;
        
        // Tooltip: transaction details
        const tooltip = `${typeText}\n${categoryName}\n${walletName}`;
        
        events.push({
          title: title,
          date: eventDate,
          backgroundColor: color,
          borderColor: color,
          textColor: '#fff',
          display: 'block',
          extendedProps: {
            tooltip: tooltip,
            category: categoryName,
            wallet: walletName,
            type: typeText
          }
        });
      }
    });
    
    this.calendarOptions.events = events;
    // Force calendar update by creating a new object reference
    this.calendarOptions = { ...this.calendarOptions };
  }

  checkDarkMode() {
    // Check if dark mode is active and update calendar theme
    const isDark = document.documentElement.classList.contains('dark');
    this.updateCalendarTheme(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      this.updateCalendarTheme(isDarkNow);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  updateCalendarTheme(isDark: boolean) {
    // The CSS handles the theme changes, but we can trigger a re-render if needed
    // FullCalendar will pick up the CSS changes automatically
    // Force a calendar re-render by updating the options
    setTimeout(() => {
      this.calendarOptions = { ...this.calendarOptions };
    }, 100);
  }
}
