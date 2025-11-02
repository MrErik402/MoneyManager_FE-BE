import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../Services/popup.service';

@Component({
  selector: 'app-notification-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.scss',
})
export class NotificationPopupComponent implements OnInit {
  showPopup = false;

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.popupService.showPopup$.subscribe((show) => {
      this.showPopup = show;
      if (show) {
        setTimeout(() => {
          this.popupService.hide();
        }, 3000);
      }
    });
  }
}

