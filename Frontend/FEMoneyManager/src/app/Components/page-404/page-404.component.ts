import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.scss'
})
export class Page404Component {
  constructor(private location: Location) {}

  goBack() {
    // Visszalépés a böngésző előző oldalára
    this.location.back();
  }
}
