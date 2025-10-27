import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../Interfaces/Message';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private messageSubject = new BehaviorSubject<Message | null>(null);

  message$ = this.messageSubject.asObservable(); // Observable, amire fel lehet iratkozni -> kívülről erre lehet feliratkozni

  constructor() {}

  show(severity: Message['severity'], title: string, msg: string) {
    this.messageSubject.next({ severity, title, msg });

    setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide() {
    this.messageSubject.next(null);
  }
}