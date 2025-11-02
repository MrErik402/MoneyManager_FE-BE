import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { TranzakcioFelvetelComponent } from './Components/tranzakcio-felvetel/tranzakcio-felvetel.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { MyaccountComponent } from './Components/myaccount/myaccount.component';
import { Page404Component } from './Components/page-404/page-404.component';
import { RedirectComponent } from './Components/redirect/redirect.component';
import { authGuard } from './guards/auth.guard';
<<<<<<< HEAD
import { CalendarComponent } from './Components/calendar/calendar.component';
import { KategoriaKezeles } from './Components/kategoriak/kategoria-kezeles/kategoria-kezeles.component';
import { KategoriaUrlap } from './Components/kategoriak/kategoria-urlap/kategoria-urlap.component';
=======
import { PenztarcaKezeles } from './Components/penztarcak/penztarca-kezeles/penztarca-kezeles.component';
import { PenztarcaUrlap } from './Components/penztarcak/penztarca-urlap/penztarca-urlap.component';
import { TranzakcioMegjelenitComponent } from './Components/tranzakcio-megjelenit/tranzakcio-megjelenit.component';
<<<<<<< HEAD
import { StatisticsComponent } from './Components/statistics/statistics.component';
import { NotificationListComponent } from './Components/notification-list/notification-list.component';
import { KategoriaMegjelenitComponent } from './Components/kategoriak/kategoria-megjelenit/kategoria-megjelenit.component';
import { NotificationPreferencesComponent } from './Components/notification-preferences/notification-preferences.component';
=======
>>>>>>> fc6d356c37e2f3edbafd4d6980f3c07f897f3c67
>>>>>>> 13f67c61dbcfda67a56d4d5f036e2b243f1dd6ec

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
<<<<<<< HEAD
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [authGuard],
  },
  {
    path: 'calendar/:id',
    component: CalendarComponent,
    canActivate: [authGuard],
  },
  {
    path: 'kategoriak',
    component: KategoriaKezeles,
    canActivate: [authGuard],
  },
  {
    path: 'kategoriak/:id',
    component: KategoriaUrlap,
    canActivate: [authGuard],
  },
  {
    path: 'kategoriak/:id/szerkesztes',
    component: KategoriaUrlap,
    canActivate: [authGuard],
  },
  {
    path: 'kategoriak/uj',
    component: KategoriaUrlap,
    canActivate: [authGuard],
  },
  {
    path: 'tranzakciok',
    component: TranzakcioFelvetelComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tranzakciok/:id',
    component: TranzakcioFelvetelComponent,
    canActivate: [authGuard],
  },
=======

>>>>>>> fc6d356c37e2f3edbafd4d6980f3c07f897f3c67
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
