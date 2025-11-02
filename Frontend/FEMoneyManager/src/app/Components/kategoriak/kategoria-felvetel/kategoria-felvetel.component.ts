import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { NotificationsService } from '../../../Services/notifications.service';
import { Category } from '../../../Interfaces/Category';
import { from } from 'rxjs';

@Component({
  selector: 'app-kategoria-felvetel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './kategoria-felvetel.component.html',
  styleUrl: './kategoria-felvetel.component.scss',
})
export class KategoriaFelvetelComponent {
  form: any;
  loading = false;
  editingCategoryId: string | null = null;
  isEditMode = false;
  
  private apiUrl = 'http://localhost:3000';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notifications: NotificationsService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  loadCategoryForEdit(category: Category) {
    this.isEditMode = true;
    this.editingCategoryId = category.id;
    
    this.form.patchValue({
      name: category.name
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
      name: value.name ?? ''
    };

    const request = this.isEditMode && this.editingCategoryId
      ? from(this.api.patch(`${this.apiUrl}/categories`, this.editingCategoryId as any, payload))
      : from(this.api.post(`${this.apiUrl}/categories`, payload));

    request.subscribe({
      next: () => {
        this.loading = false;
        const message = this.isEditMode ? 'Kategória frissítve' : 'Kategória felvéve';
        this.notifications.show('success', 'Siker', message);
        
        this.form.reset();
        this.isEditMode = false;
        this.editingCategoryId = null;
        
        window.location.reload();
      },
      error: () => {
        this.loading = false;
        const message = this.isEditMode ? 'Nem sikerült frissíteni a kategóriát' : 'Nem sikerült felvenni a kategóriát';
        this.notifications.show('error', 'Hiba', message);
      }
    });
  }

  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
    this.editingCategoryId = null;
  }
}

