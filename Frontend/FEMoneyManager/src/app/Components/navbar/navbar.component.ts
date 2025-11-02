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
      text: 'Főoldal',
      link: '/home',
      icon: 'https://cdn-icons-png.freepik.com/512/9239/9239307.png?ga=GA1.1.1194572750.1761656981'
    },
    {
      text: 'Regisztráció',
      link: '/registration',
      icon: 'https://cdn-icons-png.freepik.com/512/10416/10416185.png'
    },
    {
      text: 'Bejelentkezés',
      link: '/login',
      icon: 'https://cdn-icons-png.freepik.com/512/14897/14897480.png'
    }
  ];

  userNavItems: NavItem[] = [
    
    
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
      text: 'Profilom',
      link: '/myaccount',
      icon: 'https://cdn-icons-png.freepik.com/512/16861/16861451.png?ga=GA1.1.1194572750.1761656981'
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
    document.body.style.overflow = '';
  }

  subscribeToUserChanges() {
    this.userSubscription = this.sessionService.user$.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
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
      this.isMenuOpen = false;
      
      this.authService.logout().then(() => {
        this.checkLoginStatus();
        
        window.location.href = '/';
        
        console.log('User logged out successfully');
      }).catch((error) => {
        console.error('Logout error:', error);
        this.checkLoginStatus();
        window.location.href = '/';
      });
    }
  }
}
