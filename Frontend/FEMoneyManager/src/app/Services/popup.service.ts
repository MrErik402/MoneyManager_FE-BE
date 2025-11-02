import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private showPopupSubject = new BehaviorSubject<boolean>(false);
  showPopup$ = this.showPopupSubject.asObservable();

  constructor() {}

  show() {
    this.showPopupSubject.next(true);
  }

  hide() {
    this.showPopupSubject.next(false);
  }
}


