import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationsService } from '../../../Services/notifications.service';
import { ApiService } from '../../../Services/api.service';
import { Wallet } from '../../../Interfaces/Wallet';
import { from } from 'rxjs';

@Component({
  selector: 'app-penztarca-urlap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './penztarca-urlap.component.html',
  styleUrls: ['./penztarca-urlap.component.scss']
})
export class PenztarcaUrlap {
  id: string | null = null;
  form: any;
  loading = false;
  private apiUrl = 'http://localhost:3000/wallets';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private notifications: NotificationsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      name: ['', Validators.required],
      balance: [0, [Validators.required]]
    });
    
    const state = history.state?.entity;
    if (state) {
      this.form.patchValue({ name: state.name, balance: state.balance });
    } else if (this.id) {
      from(this.api.getOne<Wallet>(this.apiUrl, this.id as any)).subscribe({
        next: (response) => {
          if (response.data) {
            this.form.patchValue({ name: response.data.name, balance: response.data.balance });
          }
        },
        error: () => this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a pénztárcát')
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
    
    const request = this.id
      ? from(this.api.patch(this.apiUrl, this.id as any, payload))
      : from(this.api.post(this.apiUrl, payload));
    
    request.subscribe({
      next: () => {
        this.loading = false;
        this.notifications.show('success', 'Siker', 'Pénztárca mentve');
        this.router.navigate(['/penztarcak']);
      },
      error: () => {
        this.loading = false;
        this.notifications.show('error', 'Hiba', 'Nem sikerült menteni');
      }
    });
  }

  delete() {
    if (!this.id) {
      return;
    }
    from(this.api.delete(this.apiUrl, this.id as any)).subscribe({
      next: () => {
        this.notifications.show('warning', 'Figyelem', 'Pénztárca törölve');
        this.router.navigate(['/penztarcak']);
      },
      error: () => this.notifications.show('error', 'Hiba', 'Nem sikerült törölni')
    });
  }
}
