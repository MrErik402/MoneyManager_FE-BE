import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Interfaces/User';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly cookieName = 'mm_user';
  private readonly cookieMaxAgeDays = 7;

  private userSubject = new BehaviorSubject<User | null>(this.readUserFromCookie());
  user$ = this.userSubject.asObservable();

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  setUser(user: any): void {
    const normalized = this.normalizeUser(user);
    this.setCookie(this.cookieName, JSON.stringify(normalized), this.cookieMaxAgeDays);
    this.userSubject.next(normalized);
  }

  clearUser(): void {
    this.deleteCookie(this.cookieName);
    this.userSubject.next(null);
  }

  private readUserFromCookie(): User | null {
    try {
      const raw = this.getCookie(this.cookieName);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return this.normalizeUser(parsed);
    } catch {
      return null;
    }
  }

  private normalizeUser(input: any): User {
    const src = input && input.user ? input.user : input;
    const roleValue = typeof src?.role === 'string' ? src.role : src?.role?.role;
    const normalized: User = {
      id: src?.id || '',
      name: src?.name || '',
      email: src?.email || '',
      password: '',
      role: { role: (roleValue === 'admin' ? 'admin' : 'user') },
      status: typeof src?.status === 'boolean' ? src.status : true,
    };
    return normalized;
  }

  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  }
}


