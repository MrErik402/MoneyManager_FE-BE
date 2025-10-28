import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '../Services/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // Ellenőrizzük, hogy be van-e jelentkezve
  if (sessionService.isLoggedIn()) {
    return true;
  }

  // Ha nincs bejelentkezve, átirányítjuk a login oldalra
  // Opcionálisan menthetjük az eredeti URL-t, hogy bejelentkezés után oda menjünk vissza
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  
  return false;
};

