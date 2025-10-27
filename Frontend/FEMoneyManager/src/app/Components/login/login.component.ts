import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isDarkMode = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    
  }



  registrationHandler() {
    // TODO: Implement registration logic
    console.log('Registration handler called');
  }
}