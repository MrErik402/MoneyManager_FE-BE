import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { TranzakcioFelvetelComponent } from './Components/tranzakcio-felvetel/tranzakcio-felvetel.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'tranzakciok',
    component: TranzakcioFelvetelComponent,
  },
  {
    path: 'tranzakciok/:id',
    component: TranzakcioFelvetelComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
