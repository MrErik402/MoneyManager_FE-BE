import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { NotificationsService } from '../../Services/notifications.service';
import { Transaction } from '../../Interfaces/Transaction';
import { Wallet } from '../../Interfaces/Wallet';
import { Category } from '../../Interfaces/Category';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { TranzakcioFelvetelComponent } from '../tranzakcio-felvetel/tranzakcio-felvetel.component';

@Component({
  selector: 'app-tranzakcio-megjelenit',
  standalone: true,
  imports: [CommonModule, TranzakcioFelvetelComponent],
  templateUrl: './tranzakcio-megjelenit.component.html',
  styleUrl: './tranzakcio-megjelenit.component.scss',
})
export class TranzakcioMegjelenitComponent {
  @ViewChild(TranzakcioFelvetelComponent) transactionForm!: TranzakcioFelvetelComponent;
  
  baseUrl = 'http://localhost:3000';
  transactions: Transaction[] = [];
  wallets: Wallet[] = [];
  categories: Category[] = [];
  walletId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private notifications: NotificationsService
  ) {
    this.walletId = this.route.snapshot.paramMap.get('id');
    this.loadWallets();
    this.loadCategories();
    this.loadTransactions();
  }

  loadWallets() {
    from(this.api.getAll(`${this.baseUrl}/wallets`)).subscribe({
      next: (response: any) => {
        this.wallets = response.data || [];
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a pénztárcákat');
      }
    });
  }

  loadCategories() {
    from(this.api.getAll(`${this.baseUrl}/categories`)).subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a kategóriákat');
      }
    });
  }

  loadTransactions() {
    this.loading = true;
    this.error = null;
    from(this.api.getAll(`${this.baseUrl}/transactions`)).subscribe({
      next: (response: any) => {
        const allTransactions = response.data || [];
        
        // Filter by wallet ID if provided
        if (this.walletId) {
          this.transactions = allTransactions.filter((t: Transaction) => t.walletID === this.walletId);
        } else {
          this.transactions = allTransactions;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.error = 'Nem sikerült betölteni a tranzakciókat';
        this.loading = false;
      }
    });
  }

  getWalletName(walletId: string): string {
    const wallet = this.wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'N/A';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  }

  editTransaction(transaction: Transaction) {
    if (this.transactionForm) {
      this.transactionForm.loadTransactionForEdit(transaction);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  deleteTransaction(transaction: Transaction) {
    if (confirm('Biztosan törölni szeretnéd ezt a tranzakciót?')) {
      // First, update the wallet balance by reversing the transaction's effect
      // Then delete the transaction only after wallet balance is updated successfully
      this.updateWalletBalanceOnDelete(transaction, () => {
        // After wallet balance is updated, delete the transaction
        from(this.api.delete(`${this.baseUrl}/transactions`, transaction.id as any)).subscribe({
          next: () => {
            this.notifications.show('warning', 'Figyelem', 'Tranzakció törölve');
            this.loadTransactions();
          },
          error: () => {
            this.notifications.show('error', 'Hiba', 'Nem sikerült törölni a tranzakciót');
          }
        });
      });
    }
  }

  /**
   * Updates wallet balance when a transaction is deleted
   * Reverses the transaction's effect on the wallet balance
   * @param transaction The transaction being deleted
   * @param onSuccess Callback to execute after wallet balance is successfully updated
   */
  private updateWalletBalanceOnDelete(transaction: Transaction, onSuccess?: () => void) {
    const wallet = this.wallets.find(w => w.id === transaction.walletID);
    
    if (!wallet) {
      // If wallet not found, proceed with deletion anyway (but log warning)
      console.warn('Wallet not found for transaction deletion, proceeding with deletion');
      if (onSuccess) {
        onSuccess();
      }
      return;
    }

    // Calculate the new balance by reversing the transaction's effect
    let newBalance = wallet.balance;
    if (transaction.type === 'bevétel') {
      // Transaction was income, so subtract it from balance (reverse the effect)
      newBalance -= transaction.amount;
    } else {
      // Transaction was expense, so add it back to balance (reverse the effect)
      newBalance += transaction.amount;
    }
    
    // Update the wallet balance in the backend
    from(this.api.patch(`${this.baseUrl}/wallets`, transaction.walletID as any, { balance: newBalance })).subscribe({
      next: () => {
        // Update local wallet balance
        wallet.balance = newBalance;
        // Reload wallets to ensure UI is in sync
        this.loadWallets();
        // Execute callback if provided
        if (onSuccess) {
          onSuccess();
        }
      },
      error: (error) => {
        console.error('Failed to update wallet balance after transaction deletion:', error);
        this.notifications.show('error', 'Hiba', 'Nem sikerült frissíteni a pénztárca egyenlegét');
        // Don't proceed with transaction deletion if wallet update failed
      }
    });
  }

  getTransactions() {
    this.loadTransactions();
  }
}
