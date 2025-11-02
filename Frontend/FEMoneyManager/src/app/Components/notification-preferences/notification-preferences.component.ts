import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { NotificationsService } from '../../Services/notifications.service';
import { NotificationPreferences } from '../../Interfaces/NotificationPreferences';
import { from } from 'rxjs';

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-preferences.component.html',
  styleUrl: './notification-preferences.component.scss',
})
export class NotificationPreferencesComponent implements OnInit {
  form: any;
  loading = false;
  private apiUrl = 'http://localhost:3000';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notifications: NotificationsService
  ) {
    this.form = this.fb.group({
      lowBalanceThreshold: [1000, [Validators.required, Validators.min(0)]],
      negativeBalanceEnabled: [true],
      highBalanceThreshold: [10000000, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadPreferences();
  }

  loadPreferences() {
    from(this.api.getAll(`${this.apiUrl}/user_notification_preferences`)).subscribe({
      next: (response: any) => {
        const prefs: NotificationPreferences = response.data?.[0];
        if (prefs) {
          this.form.patchValue({
            lowBalanceThreshold: prefs.lowBalanceThreshold,
            negativeBalanceEnabled: prefs.negativeBalanceEnabled,
            highBalanceThreshold: prefs.highBalanceThreshold
          });
        }
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a beállításokat');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    
    const payload = {
      lowBalanceThreshold: Number(value.lowBalanceThreshold),
      negativeBalanceEnabled: value.negativeBalanceEnabled ? 1 : 0,
      highBalanceThreshold: Number(value.highBalanceThreshold)
    };

    from(this.api.post(`${this.apiUrl}/user_notification_preferences`, payload)).subscribe({
      next: () => {
        this.loading = false;
        this.notifications.show('success', 'Siker', 'Értesítési beállítások mentve');
      },
      error: () => {
        this.loading = false;
        this.notifications.show('error', 'Hiba', 'Nem sikerült menteni a beállításokat');
      }
    });
  }
}


