import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { TranzakcioFelvetelComponent } from './Components/tranzakcio-felvetel/tranzakcio-felvetel.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { MyaccountComponent } from './Components/myaccount/myaccount.component';
import { Page404Component } from './Components/page-404/page-404.component';
import { RedirectComponent } from './Components/redirect/redirect.component';
import { authGuard } from './guards/auth.guard';
import { PenztarcaKezeles } from './Components/penztarcak/penztarca-kezeles/penztarca-kezeles.component';
import { PenztarcaUrlap } from './Components/penztarcak/penztarca-urlap/penztarca-urlap.component';
import { TranzakcioMegjelenitComponent } from './Components/tranzakcio-megjelenit/tranzakcio-megjelenit.component';
import { StatisticsComponent } from './Components/statistics/statistics.component';
import { NotificationListComponent } from './Components/notification-list/notification-list.component';
import { KategoriaMegjelenitComponent } from './Components/kategoriak/kategoria-megjelenit/kategoria-megjelenit.component';
import { NotificationPreferencesComponent } from './Components/notification-preferences/notification-preferences.component';

export const routes: Routes = [
  {
    path: 'penztarcak',
    component: PenztarcaKezeles,
  },
  {
    path: 'penztarcak/uj',
    component: PenztarcaUrlap,
  },
  {
    path: 'penztarcak/:id/szerkesztes',
    component: PenztarcaUrlap,
  },
  {
    path: 'penztarcak/:id',
    component: PenztarcaKezeles,
  },
  {
    path: 'tranzakciok',
    component: TranzakcioMegjelenitComponent,
  },
  {
    path: 'tranzakciok/:id',
    component: TranzakcioMegjelenitComponent,
  },
  {
    path: 'kategoriak',
    component: KategoriaMegjelenitComponent,
  },
  {
    path: 'home',
    component: LandingPageComponent,
    
  },

  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'myaccount',
    component: MyaccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
  },
  {
    path: 'ertesitesek',
    component: NotificationListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ertesites-beallitasok',
    component: NotificationPreferencesComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: RedirectComponent,
  },
  {
    path: '**',
    component: Page404Component,
  },
  
];
