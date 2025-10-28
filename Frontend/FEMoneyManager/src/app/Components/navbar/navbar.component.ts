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
      icon: '🏠'
    },
    {
      text: 'Profilom',
      link: '/myaccount',
      icon: '👤'
    },
    {
      text: 'Kijelentkezés',
      link: '#',
      icon: '🚪',
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
  }

  closeMenu() {
    this.isMenuOpen = false;
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
