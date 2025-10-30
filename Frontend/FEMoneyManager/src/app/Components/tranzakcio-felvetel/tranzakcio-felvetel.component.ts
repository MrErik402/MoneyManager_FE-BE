import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { NotificationsService } from '../../Services/notifications.service';
import { Wallet } from '../../Interfaces/Wallet';
import { Category } from '../../Interfaces/Category';
import { Transaction } from '../../Interfaces/Transaction';
import { from } from 'rxjs';

@Component({
  selector: 'app-tranzakcio-felvetel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tranzakcio-felvetel.component.html',
  styleUrl: './tranzakcio-felvetel.component.scss',
})
export class TranzakcioFelvetelComponent {
  form: any;
  wallets: Wallet[] = [];
  categories: Category[] = [];
  loading = false;
  walletIdFromParams: string | null = null;
  editingTransactionId: string | null = null;
  isEditMode = false;
  originalTransaction: Transaction | null = null; // Store original transaction for balance recalculation
  
  private apiUrl = 'http://localhost:3000';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notifications: NotificationsService
  ) {
    this.form = this.fb.group({
      walletID: ['', Validators.required],
      categoryID: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required]
    });
    
    this.walletIdFromParams = this.route.snapshot.paramMap.get('id');
    this.loadWallets();
    this.loadCategories();
  }

  loadWallets() {
    from(this.api.getAll(`${this.apiUrl}/wallets`)).subscribe({
      next: (response: any) => {
        this.wallets = response.data || [];
        
        // If wallet ID is in params, pre-select it
        if (this.walletIdFromParams && this.wallets.length > 0) {
          const walletExists = this.wallets.find(w => w.id === this.walletIdFromParams);
          if (walletExists) {
            this.form.patchValue({ walletID: this.walletIdFromParams });
          }
        }
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a pénztárcákat');
      }
    });
  }

  loadCategories() {
    from(this.api.getAll(`${this.apiUrl}/categories`)).subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a kategóriákat');
      }
    });
  }

  loadTransactionForEdit(transaction: Transaction) {
    this.isEditMode = true;
    this.editingTransactionId = transaction.id;
    // Store the original transaction data for balance recalculation
    this.originalTransaction = { ...transaction };
    
    // Convert backend type to form type
    const formType = transaction.type === 'bevétel' ? 'income' : 'expense';
    
    this.form.patchValue({
      walletID: transaction.walletID,
      categoryID: transaction.categoryID,
      amount: transaction.amount,
      type: formType
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    
    // Convert type from HTML values to backend values
    const type = value.type === 'income' ? 'bevétel' : 'kiadás';
    const newAmount = Number(value.amount ?? 0);
    const newWalletID = value.walletID ?? '';
    
    const payload = {
      walletID: newWalletID,
      categoryID: value.categoryID ?? '',
      amount: newAmount,
      type: type
    };

    // Update wallet balance based on transaction type
    this.updateWalletBalance(type, newAmount, newWalletID);

    const request = this.isEditMode && this.editingTransactionId
      ? from(this.api.patch(`${this.apiUrl}/transactions`, this.editingTransactionId as any, payload))
      : from(this.api.post(`${this.apiUrl}/transactions`, payload));

    request.subscribe({
      next: () => {
        this.loading = false;
        const message = this.isEditMode ? 'Tranzakció frissítve' : 'Tranzakció felvéve';
        this.notifications.show('success', 'Siker', message);
        
        // Reset form and edit mode
        this.form.reset();
        this.isEditMode = false;
        this.editingTransactionId = null;
        this.originalTransaction = null;
        
        // Reload page to refresh transactions list
        window.location.reload();
      },
      error: () => {
        this.loading = false;
        const message = this.isEditMode ? 'Nem sikerült frissíteni a tranzakciót' : 'Nem sikerült felvenni a tranzakciót';
        this.notifications.show('error', 'Hiba', message);
      }
    });
  }

  /**
   * Updates wallet balance correctly handling both new transactions and edits
   */
  private updateWalletBalance(newType: string, newAmount: number, newWalletID: string) {
    if (this.isEditMode && this.originalTransaction) {
      // EDIT MODE: First reverse the original transaction's effect, then apply the new one
      const originalAmount = this.originalTransaction.amount;
      const originalType = this.originalTransaction.type;
      const originalWalletID = this.originalTransaction.walletID;
      const walletChanged = originalWalletID !== newWalletID;
      
      if (walletChanged) {
        // Wallet changed: update both wallets separately
        // Reverse original transaction effect on original wallet
        const originalWallet = this.wallets.find(w => w.id === originalWalletID);
        if (originalWallet) {
          if (originalType === 'bevétel') {
            // Original was income, so subtract it
            originalWallet.balance -= originalAmount;
          } else {
            // Original was expense, so add it back
            originalWallet.balance += originalAmount;
          }
          // Update the original wallet balance in the backend
          from(this.api.patch(`${this.apiUrl}/wallets`, originalWalletID as any, { balance: originalWallet.balance })).subscribe();
        }
        
        // Apply new transaction effect on new wallet
        const newWallet = this.wallets.find(w => w.id === newWalletID);
        if (newWallet) {
          if (newType === 'bevétel') {
            // New is income, add it
            newWallet.balance += newAmount;
          } else {
            // New is expense, subtract it
            newWallet.balance -= newAmount;
          }
          // Update the new wallet balance in the backend
          from(this.api.patch(`${this.apiUrl}/wallets`, newWalletID as any, { balance: newWallet.balance })).subscribe();
        }
      } else {
        // Same wallet: calculate net change and update once
        const wallet = this.wallets.find(w => w.id === newWalletID);
        if (wallet) {
          // Reverse original transaction
          if (originalType === 'bevétel') {
            wallet.balance -= originalAmount;
          } else {
            wallet.balance += originalAmount;
          }
          
          // Apply new transaction
          if (newType === 'bevétel') {
            wallet.balance += newAmount;
          } else {
            wallet.balance -= newAmount;
          }
          
          // Single update to backend
          from(this.api.patch(`${this.apiUrl}/wallets`, newWalletID as any, { balance: wallet.balance })).subscribe();
        }
      }
    } else {
      // NEW TRANSACTION MODE: Simply apply the transaction effect
      const wallet = this.wallets.find(w => w.id === newWalletID);
      if (wallet) {
        if (newType === 'bevétel') {
          // Income: add to balance
          wallet.balance += newAmount;
        } else {
          // Expense: subtract from balance
          wallet.balance -= newAmount;
        }
        // Update wallet balance in the backend
        from(this.api.patch(`${this.apiUrl}/wallets`, newWalletID as any, { balance: wallet.balance })).subscribe();
      }
    }
  }

  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.originalTransaction = null;
  }
}
