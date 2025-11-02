import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';
import { NotificationsService } from '../../../Services/notifications.service';
import { Category } from '../../../Interfaces/Category';
import { from } from 'rxjs';
import { KategoriaFelvetelComponent } from '../kategoria-felvetel/kategoria-felvetel.component';

@Component({
  selector: 'app-kategoria-megjelenit',
  standalone: true,
  imports: [CommonModule, KategoriaFelvetelComponent],
  templateUrl: './kategoria-megjelenit.component.html',
  styleUrl: './kategoria-megjelenit.component.scss',
})
export class KategoriaMegjelenitComponent {
  @ViewChild(KategoriaFelvetelComponent) categoryForm!: KategoriaFelvetelComponent;
  
  baseUrl = 'http://localhost:3000';
  allCategories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private notifications: NotificationsService
  ) {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = null;
    from(this.api.getAll(`${this.baseUrl}/categories`)).subscribe({
      next: (response: any) => {
        this.allCategories = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Nem sikerült betölteni a kategóriákat';
        this.loading = false;
      }
    });
  }

  editCategory(category: Category) {
    if (this.categoryForm) {
      this.categoryForm.loadCategoryForEdit(category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  deleteCategory(category: Category) {
    if (confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
      from(this.api.delete(`${this.baseUrl}/categories`, category.id as any)).subscribe({
        next: () => {
          this.notifications.show('warning', 'Figyelem', 'Kategória törölve');
          this.loadCategories();
        },
        error: () => {
          this.notifications.show('error', 'Hiba', 'Nem sikerült törölni a kategóriát');
        }
      });
    }
  }

  refreshCategories() {
    this.loadCategories();
  }
}

