import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from '../../Services/notifications.service';
import { SessionService } from '../../Services/session.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private api: ApiService, private authService: AuthService, private router: Router, private notificationsService: NotificationsService, private sessionService: SessionService) {}

  ngOnInit() {
    
  }

  loginHandler() {
    if (!this.email || !this.password) {
      this.notificationsService.show('error', 'Hiba', 'Minden mező kitöltése kötelező');
      return;
    }
    this.authService.login(this.email, this.password).then((response: any) => {
      console.log(response);
      if (response.status === 200) {
          this.authService.me().then((meResponse: any) => {
            if (meResponse && meResponse.status === 200) {
              this.sessionService.setUser(meResponse.data);
              this.notificationsService.show('success', 'Siker', 'Sikeres bejelentkezés');
              this.router.navigate(['/myaccount']);
            } else {
              this.notificationsService.show('error', 'Hiba', 'Nem sikerült lekérni a felhasználói adatokat');
            }
          }).catch(() => {
            this.notificationsService.show('error', 'Hiba', 'Nem sikerült lekérni a felhasználói adatokat');
          });
      } else {
        this.notificationsService.show('error', 'Hiba', 'Sikertelen bejelentkezés');
      }
    });
  }
}