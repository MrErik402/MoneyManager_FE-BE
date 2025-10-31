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
  allTransactions: Transaction[] = []; // Store all transactions
  filteredTransactions: Transaction[] = []; // Displayed transactions after filtering
  wallets: Wallet[] = [];
  categories: Category[] = [];
  walletId: string | null = null;
  loading = false;
  error: string | null = null;
  
  // Filter state
  selectedWalletId: string = 'all';
  selectedCategoryId: string = 'all';
  selectedType: string = 'all';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private notifications: NotificationsService
  ) {
    this.walletId = this.route.snapshot.paramMap.get('id');
    // Initialize filter with wallet ID from route if present
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
        
        // If wallet ID is in route params and wallets are loaded, ensure it's selected
        if (this.walletId && this.wallets.length > 0) {
          const walletExists = this.wallets.find(w => w.id === this.walletId);
          if (walletExists) {
            this.selectedWalletId = this.walletId;
            // Reapply filters after setting the wallet selection
            this.applyFilters();
          } else {
            // Wallet from route doesn't exist, reset to 'all'
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

  /**
   * Applies filters to transactions based on selected wallet, category, and type
   */
  applyFilters() {
    let filtered = [...this.allTransactions];

    // Filter by wallet
    if (this.selectedWalletId && this.selectedWalletId !== 'all') {
      filtered = filtered.filter((t: Transaction) => t.walletID === this.selectedWalletId);
    }

    // Filter by category
    if (this.selectedCategoryId && this.selectedCategoryId !== 'all') {
      filtered = filtered.filter((t: Transaction) => t.categoryID === this.selectedCategoryId);
    }

    // Filter by type
    if (this.selectedType && this.selectedType !== 'all') {
      const backendType = this.selectedType === 'income' ? 'bevétel' : 'kiadás';
      filtered = filtered.filter((t: Transaction) => t.type === backendType);
    }

    this.filteredTransactions = filtered;
  }

  /**
   * Handles wallet filter change
   */
  onWalletFilterChange(walletId: string) {
    this.selectedWalletId = walletId;
    this.applyFilters();
  }

  /**
   * Handles category filter change
   */
  onCategoryFilterChange(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  /**
   * Handles type filter change
   */
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
      // First, update the wallet balance by reversing the transaction's effect
      // Then delete the transaction only after wallet balance is updated successfully
      this.updateWalletBalanceOnDelete(transaction, () => {
        // After wallet balance is updated, delete the transaction
        from(this.api.delete(`${this.baseUrl}/transactions`, transaction.id as any)).subscribe({
          next: () => {
            this.notifications.show('warning', 'Figyelem', 'Tranzakció törölve');
            this.loadTransactions(); // This will reload and reapply filters
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
