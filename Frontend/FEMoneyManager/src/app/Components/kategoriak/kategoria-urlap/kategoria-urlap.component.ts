import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-kategoria-urlap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './kategoria-urlap.component.html',
  styleUrls: ['./kategoria-urlap.component.scss']
})
export class KategoriaUrlap {
  id = this.route.snapshot.paramMap.get('id');
  form = this.fb.group({
    name: ['', Validators.required]
  });
  loading = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private categories: CategoryService, private router: Router, private notifications: NotificationService) {
    const state = history.state?.entity;
    if (state) {
      this.form.patchValue({ name: state.name });
    } else if (this.id) {
      this.categories.getById(this.id).subscribe(category => this.form.patchValue({ name: category.name }));
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const value = this.form.getRawValue();
    const payload = { name: value.name ?? '' };
    const request = this.id ? this.categories.update(this.id, payload) : this.categories.create(payload);
    request.subscribe({
      next: () => {
        this.loading = false;
        this.notifications.info('Kategória mentve');
        this.router.navigate(['/kategoriak']);
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
    this.categories.delete(this.id).subscribe({
      next: () => {
        this.notifications.warn('Kategória törölve');
        this.router.navigate(['/kategoriak']);
      },
      error: () => this.notifications.error('Nem sikerült törölni')
    });
  }
}
