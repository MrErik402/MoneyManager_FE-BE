import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';

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

  constructor(private api: ApiService, private authService: AuthService, private notificationsService: NotificationsService, private sessionService: SessionService) {}

  ngOnInit() {

  }



  registrationHandler() {
    if (!this.email || !this.password || !this.passwordConfirm || !this.name || !this.checkbox) {
      this.notificationsService.show('error', 'Hiba', 'Minden mező kitöltése kötelező');
      return;
    }
    if (this.password !== this.passwordConfirm) {
      this.notificationsService.show('error', 'Hiba', 'A jelszavak nem egyeznek');
      return;
    }
    this.authService.register(this.name, this.email, this.password).then((response: any) => {
      if (response.status > 199 && response.status < 300) {
        // Optionally auto-login after registration
        this.authService.login(this.email, this.password).then((loginResponse: any) => {
          if (loginResponse.status === 200) {
            this.authService.me().then((meResponse: any) => {
              if (meResponse && meResponse.status === 200) {
                this.sessionService.setUser(meResponse.data);
              }
            });
          }
        });
        this.notificationsService.show('success', 'Sikeres regisztráció', 'Sikeresen regisztráltál');
      } else {
        this.notificationsService.show('error', 'Hiba', 'Sikertelen regisztráció');
      }
    });
  }
}