import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Message } from '../../Interfaces/Message';
import { NotificationsService } from '../../Services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  message: Message | null = null;
  hidden: boolean = false;
  durationMs: number = 5000;
  showBar: boolean = true;

  // Fel kell iratkozni a service üzenetére
  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.notificationsService.message$.subscribe((msg: Message | null) => {
      this.message = msg;
      this.hidden = msg ? false : true;

      if (msg) {
        // Beállítjuk az időtartamot a service alapján és újraindítjuk az animációt
        this.durationMs = this.notificationsService.autoHideMs;
        this.resetProgressAnimation();
      }
    });
  }

  closeMessage() {
    this.hidden = true;
    this.notificationsService.hide();
  }

  private resetProgressAnimation() {
    this.showBar = false;
    // Következő ciklusban visszakapcsoljuk, hogy az elem újra létrejöjjön és az animáció induljon
    setTimeout(() => (this.showBar = true));
  }
}