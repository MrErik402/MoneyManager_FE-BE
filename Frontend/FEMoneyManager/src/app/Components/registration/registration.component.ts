import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  isDarkMode = false;

  constructor(private api: ApiService) {}

  ngOnInit() {

  }



  registrationHandler() {
    // TODO: Implement registration logic
    console.log('Registration handler called');
  }
}