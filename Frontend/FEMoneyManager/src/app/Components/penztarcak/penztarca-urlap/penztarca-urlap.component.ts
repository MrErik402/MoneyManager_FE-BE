import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-penztarca-urlap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './penztarca-urlap.component.html',
  styleUrls: ['./penztarca-urlap.component.scss']
})
export class PenztarcaUrlap {
  id = this.route.snapshot.paramMap.get('id');
  form = this.fb.group({
    name: ['', Validators.required],
    balance: [0, [Validators.required]]
  });
  loading = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private wallets: WalletService, private router: Router, private notifications: NotificationService) {
    const state = history.state?.entity;
    if (state) {
      this.form.patchValue({ name: state.name, balance: state.balance });
    } else if (this.id) {
      this.wallets.getById(this.id).subscribe(wallet => {
        this.form.patchValue({ name: wallet.name, balance: wallet.balance });
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const value = this.form.getRawValue();
    const payload = { name: value.name ?? '', balance: Number(value.balance ?? 0) };
    const request = this.id ? this.wallets.update(this.id, payload) : this.wallets.create(payload);
    request.subscribe({
      next: () => {
        this.loading = false;
        this.notifications.info('Pénztárca mentve');
        this.router.navigate(['/penztarcak']);
      },
      error: () => {
        this.loading = false;
        this.notifications.error('Nem sikerült menteni');
      }
    });
  }

  delete() {
    if (!this.id) {
      return;
    }
    this.wallets.delete(this.id).subscribe({
      next: () => {
        this.notifications.warn('Pénztárca törölve');
        this.router.navigate(['/penztarcak']);
      },
      error: () => this.notifications.error('Nem sikerült törölni')
    });
  }
}
