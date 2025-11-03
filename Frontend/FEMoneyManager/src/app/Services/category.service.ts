import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category } from '../Interfaces/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private apiUrl = 'http://localhost:3000/categories'; // Update this with your actual API URL

  constructor(private api: ApiService) {}

  loadAll(): void {
    this.api.getAll(this.apiUrl).then((response: any) => {
      if (response.status === 200) {
        this.categoriesSubject.next(response.data);
      }
    }).catch((error: any) => {
      console.error('Error loading categories', error);
    });
  }

  getById(id: string): Observable<Category> {
    return from(
      this.api.getOne<Category>(this.apiUrl, parseInt(id))
    ).pipe(
      map(response => response.data as Category)
    );
  }

  create(category: Partial<Category>): Observable<Category> {
    return from(
      this.api.post<Category>(this.apiUrl, category)
    ).pipe(
      map(response => response.data as Category),
      tap(() => this.loadAll())
    );
  }

  update(id: string, category: Partial<Category>): Observable<Category> {
    return from(
      this.api.patch<Category>(this.apiUrl, parseInt(id), category)
    ).pipe(
      map(response => response.data as Category),
      tap(() => this.loadAll())
    );
  }

  delete(id: string): Observable<any> {
    return from(
      this.api.delete(this.apiUrl, parseInt(id))
    ).pipe(
      tap(() => this.loadAll())
    );
  }
}

