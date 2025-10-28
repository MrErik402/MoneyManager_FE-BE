import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../Interfaces/ApiResponse';
import { User } from '../../Interfaces/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../Services/notifications.service';
import { SessionService } from '../../Services/session.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  isDarkMode = false;
  email = '';
  password = '';
  passwordConfirm = '';
  name = '';
  checkbox = false;

  constructor(
    private api: ApiService, 
    private authService: AuthService, 
    private notificationsService: NotificationsService, 
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {

  }



  registrationHandler() {
    // Validáció: minden mező kitöltése kötelező
    if (!this.email || !this.password || !this.passwordConfirm || !this.name) {
      this.notificationsService.show('error', 'Hiba', 'Minden adatot meg kell adni!');
      return;
    }

    // Validáció: ÁSZF elfogadása
    if (!this.checkbox) {
      this.notificationsService.show('error', 'Hiba', 'El kell fogadni az ÁSZF-et');
      return;
    }

    // Validáció: jelszavak egyezése
    if (this.password !== this.passwordConfirm) {
      this.notificationsService.show('error', 'Hiba', 'Nem egyezik a két jelszó!');
      return;
    }

    this.authService.register(this.name, this.email, this.password).then((response: any) => {
      if (response.status > 199 && response.status < 300) {
        this.notificationsService.show('success', 'Siker', 'Sikeres regisztráció!');
        // Átirányítás a bejelentkezési oldalra
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        const errorMessage = response.data?.message || 'Sikertelen regisztráció';
        this.notificationsService.show('error', 'Hiba', errorMessage);
      }
    }).catch((error: any) => {
      const errorMessage = error.response?.data?.message || 'Sikertelen regisztráció';
      this.notificationsService.show('error', 'Hiba', errorMessage);
    });
  }
}