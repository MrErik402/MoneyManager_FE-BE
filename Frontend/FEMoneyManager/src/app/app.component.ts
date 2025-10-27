import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingPageComponent, NotificationsComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FEMoneyManager';
}
