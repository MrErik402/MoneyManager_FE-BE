import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { SessionService } from '../../Services/session.service';
import { Subscription } from 'rxjs';

interface NavItem {
  text: string;
  link: string;
  icon: string;
  action?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isDarkMode = false;
  isMenuOpen = false;
  private userSubscription?: Subscription;

  questNavItems: NavItem[] = [
    {
      text: 'Regisztráció',
      link: '/registration',
      icon: '📝'
    },
    {
      text: 'Bejelentkezés',
      link: '/login',
      icon: '🔑'
    }
  ];

  userNavItems: NavItem[] = [
    {
      text: 'Főoldal',
      link: '/home',
      icon: 'https://cdn-icons-png.freepik.com/512/9239/9239307.png?ga=GA1.1.1194572750.1761656981'
    },
    {
      text: 'Profilom',
      link: '/myaccount',
      icon: 'https://cdn-icons-png.freepik.com/512/16861/16861451.png?ga=GA1.1.1194572750.1761656981'
    },
    {
      text: 'Pénztárcák',
      link: '/penztarcak',
      icon: 'https://cdn-icons-png.freepik.com/512/7653/7653271.png?ga=GA1.1.1194572750.1761656981'
    },
    {
      text: 'Tranzakciók',
      link: '/tranzakciok',
      icon: 'https://cdn-icons-png.freepik.com/512/15355/15355096.png?ga=GA1.1.1194572750.1761656981'
    },
    {
      text: 'Kategóriák',
      link: '/kategoriak',
      icon: 'https://cdn-icons-png.freepik.com/512/13087/13087931.png?ga=GA1.1.1194572750.1761656981'
    },
    {
      text: 'Kijelentkezés',
      link: '#',
      icon: 'https://cdn-icons-png.freepik.com/512/19006/19006867.png?ga=GA1.1.1194572750.1761656981',
      action: 'logout'
    }
  ];

  constructor(
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.checkThemeState();
    this.subscribeToUserChanges();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    // Restore body scroll if menu was open
    document.body.style.overflow = '';
  }

  subscribeToUserChanges() {
    // Subscribe to user changes to automatically update login status
    this.userSubscription = this.sessionService.user$.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    // Check if user is logged in using SessionService
    this.isLoggedIn = this.sessionService.isLoggedIn();
  }

  checkThemeState() {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      this.isDarkMode = false;
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      this.isDarkMode = true;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll() {
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  logout() {
    const confirmed = confirm('Biztosan ki szeretne jelentkezni?');
    if (confirmed) {
      // Close menu
      this.isMenuOpen = false;
      
      // Call auth service logout (which also clears session via SessionService)
      this.authService.logout().then(() => {
        // Update login status (will be automatically updated via subscription)
        this.checkLoginStatus();
        
        // Redirect to home page
        window.location.href = '/';
        
        console.log('User logged out successfully');
      }).catch((error) => {
        console.error('Logout error:', error);
        // Even if logout fails, clear local state
        this.checkLoginStatus();
        window.location.href = '/';
      });
    }
  }
}
