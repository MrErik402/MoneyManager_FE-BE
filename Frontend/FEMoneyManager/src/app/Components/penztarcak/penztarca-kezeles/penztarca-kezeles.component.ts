import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Wallet } from '../../../Interfaces/Wallet';
import { ApiService } from '../../../Services/api.service';
import { NotificationsService } from '../../../Services/notifications.service';

@Component({
  selector: 'app-penztarca-kezeles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './penztarca-kezeles.component.html',
  styleUrls: ['./penztarca-kezeles.component.scss']
})
export class PenztarcaKezeles {
  private walletsSubject = new BehaviorSubject<Wallet[]>([]);
  wallets$: Observable<Wallet[]> = this.walletsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/wallets';

  constructor(private api: ApiService, private router: Router, private notifications: NotificationsService) {
    this.loadWallets();
  }

  loadWallets() {
    from(this.api.getAll(this.apiUrl)).subscribe({
      next: (response: any) => {
        this.walletsSubject.next(response.data || []);
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a pénztárcákat');
      }
    });
  }

  create() {
    this.router.navigate(['/penztarcak/uj']);
  }

  edit(wallet: Wallet) {
    this.router.navigate(['/penztarcak', wallet.id, 'szerkesztes'], { state: { entity: wallet } });
  }

  remove(wallet: Wallet) {
    from(this.api.delete(this.apiUrl, wallet.id as any)).subscribe({
      next: () => {
        this.notifications.show('warning', 'Figyelem', 'Pénztárca törölve');
        this.loadWallets();
      },
      error: () => this.notifications.show('error', 'Hiba', 'Nem sikerült törölni')
    });
  }

  openTransactions(wallet: Wallet) {
    this.router.navigate(['/tranzakciok', wallet.id]);
  }
}
