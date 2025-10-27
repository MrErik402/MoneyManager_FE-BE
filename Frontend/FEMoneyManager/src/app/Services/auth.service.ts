import { Injectable } from '@angular/core';
import axios from 'axios';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private sessionService: SessionService) {}

      // auth.service.ts
    register(name: string, email: string, password: string) {
      return axios.post(`${this.apiUrl}auth/register`, { name, email, password }, { withCredentials: true });
    }
    login(email: string, password: string) {
      return axios.post(`${this.apiUrl}auth/login`, { email, password }, { withCredentials: true });
    }
    logout() {
      this.sessionService.clearUser();
      return axios.post(`${this.apiUrl}auth/logout`, {}, { withCredentials: true });
    }
    me() {
      return axios.get(`${this.apiUrl}auth/me`, { withCredentials: true });
    }

}
