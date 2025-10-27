import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

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
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isDarkMode = false;

  questNavItems: NavItem[] = [
    {
      text: 'Főoldal',
      link: '/',
      icon: '🏠'
    },
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.checkThemeState();
  }

  checkLoginStatus() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
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

  logout() {
    const confirmed = confirm('Biztosan ki szeretne jelentkezni?');
    if (confirmed) {
      // Clear token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update login status
      this.isLoggedIn = false;
      
      // Redirect to home page
      window.location.href = '/';
      
      console.log('User logged out successfully');
    }
  }
}
