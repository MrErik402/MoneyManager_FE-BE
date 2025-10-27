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

  // Fel kell iratkozni a service üzenetére
  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.notificationsService.message$.subscribe((msg: Message | null) => {
      this.message = msg;
      this.hidden = msg ? false : true;
    });
  }

  closeMessage() {
    this.hidden = true;
  }
}