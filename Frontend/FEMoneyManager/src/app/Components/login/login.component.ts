import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private api: ApiService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    
  }

  loginHandler() {
    if (!this.email || !this.password) {
      alert('Minden mező kitöltése kötelező');
      return;
    }
    this.authService.login(this.email, this.password).then((response: any) => {
      console.log(response);
      if (response.status === 200) {
          this.router.navigate(['/myaccount']);
      } else {
        alert('Sikertelen bejelentkezés');
      }
    });
  }
}