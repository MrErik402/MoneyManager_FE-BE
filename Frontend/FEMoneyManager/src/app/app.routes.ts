import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { TranzakcioFelvetelComponent } from './Components/tranzakcio-felvetel/tranzakcio-felvetel.component';

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
];
