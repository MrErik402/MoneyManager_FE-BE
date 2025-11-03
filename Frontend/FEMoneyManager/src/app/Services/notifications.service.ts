import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../Interfaces/Message';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private messageSubject = new BehaviorSubject<Message | null>(null);

  message$ = this.messageSubject.asObservable(); // Observable, amire fel lehet iratkozni -> kívülről erre lehet feliratkozni

  // Automatikus eltűnés időtartama (ms)
  readonly autoHideMs = 5000;

  constructor() {}

  show(severity: Message['severity'], title: string, msg: string) {
    this.messageSubject.next({ severity, title, msg });

    setTimeout(() => {
      this.hide();
    }, this.autoHideMs);
  }

  info(msg: string, title: string = 'Információ') {
    this.show('info', title, msg);
  }

  warn(msg: string, title: string = 'Figyelmeztetés') {
    this.show('warning', title, msg);
  }

  error(msg: string, title: string = 'Hiba') {
    this.show('error', title, msg);
  }

  success(msg: string, title: string = 'Siker') {
    this.show('success', title, msg);
  }

  hide() {
    this.messageSubject.next(null);
  }
}