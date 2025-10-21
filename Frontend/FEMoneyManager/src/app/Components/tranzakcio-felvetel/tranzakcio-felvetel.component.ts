import { Component } from '@angular/core';
import { TranzakcioMegjelenitComponent } from '../tranzakcio-megjelenit/tranzakcio-megjelenit.component';

@Component({
  selector: 'app-tranzakcio-felvetel',
  standalone: true,
  imports: [TranzakcioMegjelenitComponent],
  templateUrl: './tranzakcio-felvetel.component.html',
  styleUrl: './tranzakcio-felvetel.component.scss',
})
export class TranzakcioFelvetelComponent {}
