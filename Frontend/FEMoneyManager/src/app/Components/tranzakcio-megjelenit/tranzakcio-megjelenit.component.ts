import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, TranzakcioFelvetelComponent],
  templateUrl: './tranzakcio-megjelenit.component.html',
  styleUrl: './tranzakcio-megjelenit.component.scss',
})
export class TranzakcioMegjelenitComponent {
  @ViewChild(TranzakcioFelvetelComponent) transactionForm!: TranzakcioFelvetelComponent;
  
  baseUrl = 'http://localhost:3000';
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  wallets: Wallet[] = [];
  categories: Category[] = [];
  walletId: string | null = null;
  loading = false;
  error: string | null = null;
  
  selectedWalletId: string = 'all';
  selectedCategoryId: string = 'all';
  selectedType: string = 'all';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private notifications: NotificationsService
  ) {
    this.walletId = this.route.snapshot.paramMap.get('id');
    if (this.walletId) {
      this.selectedWalletId = this.walletId;
    }
    this.loadWallets();
    this.loadCategories();
    this.loadTransactions();
  }

  loadWallets() {
    from(this.api.getAll(`${this.baseUrl}/wallets`)).subscribe({
      next: (response: any) => {
        this.wallets = response.data || [];
        
        if (this.walletId && this.wallets.length > 0) {
          const walletExists = this.wallets.find(w => w.id === this.walletId);
          if (walletExists) {
            this.selectedWalletId = this.walletId;
            this.applyFilters();
          } else {
            this.selectedWalletId = 'all';
          }
        }
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
        this.allTransactions = response.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.error = 'Nem sikerült betölteni a tranzakciókat';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.allTransactions];

    if (this.selectedWalletId && this.selectedWalletId !== 'all') {
      filtered = filtered.filter((t: Transaction) => t.walletID === this.selectedWalletId);
    }

    if (this.selectedCategoryId && this.selectedCategoryId !== 'all') {
      filtered = filtered.filter((t: Transaction) => t.categoryID === this.selectedCategoryId);
    }

    if (this.selectedType && this.selectedType !== 'all') {
      const backendType = this.selectedType === 'income' ? 'bevétel' : 'kiadás';
      filtered = filtered.filter((t: Transaction) => t.type === backendType);
    }

    this.filteredTransactions = filtered;
  }

  onWalletFilterChange(walletId: string) {
    this.selectedWalletId = walletId;
    this.applyFilters();
  }

  onCategoryFilterChange(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  onTypeFilterChange(type: string) {
    this.selectedType = type;
    this.applyFilters();
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
      this.updateWalletBalanceOnDelete(transaction, () => {
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

  private updateWalletBalanceOnDelete(transaction: Transaction, onSuccess?: () => void) {
    const wallet = this.wallets.find(w => w.id === transaction.walletID);
    
    if (!wallet) {
      console.warn('Wallet not found for transaction deletion, proceeding with deletion');
      if (onSuccess) {
        onSuccess();
      }
      return;
    }

    let newBalance = wallet.balance;
    if (transaction.type === 'bevétel') {
      newBalance -= transaction.amount;
    } else {
      newBalance += transaction.amount;
    }
    
    from(this.api.patch(`${this.baseUrl}/wallets`, transaction.walletID as any, { balance: newBalance })).subscribe({
      next: () => {
        wallet.balance = newBalance;
        this.loadWallets();
        if (onSuccess) {
          onSuccess();
        }
      },
      error: (error) => {
        console.error('Failed to update wallet balance after transaction deletion:', error);
        this.notifications.show('error', 'Hiba', 'Nem sikerült frissíteni a pénztárca egyenlegét');
      }
    });
  }

  getTransactions() {
    this.loadTransactions();
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
