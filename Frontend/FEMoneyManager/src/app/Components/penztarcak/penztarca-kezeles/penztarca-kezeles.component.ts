import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Wallet } from '../../../core/models/wallet.model';
import { WalletService } from '../../../core/services/wallet.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-penztarca-kezeles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './penztarca-kezeles.component.html',
  styleUrls: ['./penztarca-kezeles.component.scss']
})
export class PenztarcaKezeles {
  wallets$: Observable<Wallet[]> = this.wallets.wallets$;

  constructor(private wallets: WalletService, private router: Router, private notifications: NotificationService) {
    this.wallets.loadMine();
  }

  create() {
    this.router.navigate(['/penztarcak/uj']);
  }

  edit(wallet: Wallet) {
    this.router.navigate(['/penztarcak', wallet.id, 'szerkesztes'], { state: { entity: wallet } });
  }

  remove(wallet: Wallet) {
    this.wallets.delete(wallet.id).subscribe({
      next: () => this.notifications.warn('Pénztárca törölve'),
      error: () => this.notifications.error('Nem sikerült törölni')
    });
  }

  openTransactions(wallet: Wallet) {
    this.router.navigate(['/tranzakciok', wallet.id]);
  }
}
