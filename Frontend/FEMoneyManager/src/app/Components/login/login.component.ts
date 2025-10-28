import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  returnUrl: string = '/home';

  constructor(
    private api: ApiService, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService, 
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    // Ha már be van jelentkezve, átirányítjuk az eredeti céloldalra vagy home-ra
    if (this.sessionService.isLoggedIn()) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
      this.router.navigate([this.returnUrl]);
      return;
    }

    // Elmentjük az eredeti céloldalt (ha van), hogy bejelentkezés után oda menjünk
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  loginHandler() {
    // Validáció: e-mail ellenőrzés
    if (!this.email || this.email.trim() === '') {
      this.notificationsService.show('error', 'Hiba', 'Nem adtál meg e-mail címet!');
      return;
    }

    // Validáció: jelszó ellenőrzés
    if (!this.password || this.password.trim() === '') {
      this.notificationsService.show('error', 'Hiba', 'Nem adtál meg jelszót!');
      return;
    }

    this.authService.login(this.email, this.password).then((response: any) => {
      console.log(response);
      if (response.status === 200) {
          this.authService.me().then((meResponse: any) => {
            if (meResponse && meResponse.status === 200) {
              this.sessionService.setUser(meResponse.data);
              this.notificationsService.show('success', 'Siker', 'Sikeres bejelentkezés');
              // Átirányítás az eredeti céloldalra vagy home-ra
              this.router.navigate([this.returnUrl]);
            } else {
              this.notificationsService.show('error', 'Hiba', 'Nem sikerült lekérni a felhasználói adatokat');
            }
          }).catch(() => {
            this.notificationsService.show('error', 'Hiba', 'Nem sikerült lekérni a felhasználói adatokat');
          });
      } else {
        this.notificationsService.show('error', 'Hiba', 'Sikertelen bejelentkezés');
      }
    }).catch((error: any) => {
      // Hibás bejelentkezési adatok esetén
      this.notificationsService.show('error', 'Hiba', 'Hibás adatokat adtál meg!');
    });
  }
}