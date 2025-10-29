import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-kategoria-kezeles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kategoria-kezeles.component.html',
  styleUrls: ['./kategoria-kezeles.component.scss']
})
export class KategoriaKezeles {
  categories$: Observable<Category[]> = this.categories.categories$;

  constructor(private categories: CategoryService, private router: Router, private notifications: NotificationService) {
    this.categories.loadAll();
  }

  create() {
    this.router.navigate(['/kategoriak/uj']);
  }

  edit(category: Category) {
    this.router.navigate(['/kategoriak', category.id, 'szerkesztes'], { state: { entity: category } });
  }

  remove(category: Category) {
    this.categories.delete(category.id).subscribe({
      next: () => this.notifications.warn('Kategória törölve'),
      error: () => this.notifications.error('Nem sikerült törölni')
    });
  }
}
