import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

      // auth.service.ts
    register(name: string, email: string, password: string) {
      return this.http.post('http://localhost:3000/auth/register', { name, email, password }, { withCredentials: true });
    }
    login(email: string, password: string) {
      return this.http.post('http://localhost:3000/auth/login', { email, password }, { withCredentials: true });
    }
    logout() {
      return this.http.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
    }
    me() {
      return this.http.get('http://localhost:3000/auth/me', { withCredentials: true });
    }

}
