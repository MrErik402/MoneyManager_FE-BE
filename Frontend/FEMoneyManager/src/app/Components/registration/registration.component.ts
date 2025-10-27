import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { AuthService } from '../../Services/auth.service';
<<<<<<< HEAD
import { ApiResponse } from '../../Interfaces/ApiResponse';
=======
import { ApiResponse } from '../../interfaces/ApiResponse';
>>>>>>> f1d419bd41c6487e93b84a5261428887ea486c7e
import { User } from '../../Interfaces/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  isDarkMode = false;
  email = '';
  password = '';
  passwordConfirm = '';
  name = '';
  checkbox = false;

  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit() {

  }



  registrationHandler() {
    if (!this.email || !this.password || !this.passwordConfirm || !this.name || !this.checkbox) {
      alert('Minden mező kitöltése kötelező');
      return;
    }
    if (this.password !== this.passwordConfirm) {
      alert('A jelszavak nem egyeznek');
      return;
    }
    this.authService.register(this.name, this.email, this.password).then((response: any) => {
      console.log(response);
    });
  }
}