import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  kartyak: any[] = [
    {
      title: 'Pénztárcák',
      description: 'Több pénztárca kezelése egyszerűen',
      icon: 'penztarca.png',
      link: '/penztarcak',
    },
    {
      title: 'Tranzakciók',
      description: 'Bevételek és kiadások kezelése',
      icon: 'tranzakcio.png',
      link: '/tranzakciok',
    },
    {
      title: 'Kategóriák',
      description: 'Rendszerezett költségkövetés',
      icon: 'kategoria.png',
      link: '/kategoriak',
    },
    {
      title: 'Értesítések',
      description: 'Értesítéseid megtekintése',
      icon: 'ertesites.png',
      link: '/ertesitek',
    },
    {
      title: 'Statisztikák',
      description: 'Átlátható pénzügyi kimutatások',
      icon: 'statisztika.png',
      link: '/statisztikak',
    },
    {
      title: 'Profilom',
      description: 'Profilom megtekintése és módosítása',
      icon: 'profilom.png',
      link: '/profilom',
    },
  ];
}
