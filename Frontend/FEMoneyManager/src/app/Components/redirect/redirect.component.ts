import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../Services/session.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  template: '<div></div>'
})
export class RedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    // Ha be van jelentkezve, a home oldalra irányít
    // Ha nincs bejelentkezve, a login oldalra irányít
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

