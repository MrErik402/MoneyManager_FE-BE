import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { NotificationsService } from '../../Services/notifications.service';
import { PopupService } from '../../Services/popup.service';
import { Wallet } from '../../Interfaces/Wallet';
import { Category } from '../../Interfaces/Category';
import { Transaction } from '../../Interfaces/Transaction';
import { NotificationPreferences } from '../../Interfaces/NotificationPreferences';
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
  originalTransaction: Transaction | null = null;
  showRecurrenceOptions = false;
  
  private apiUrl = 'http://localhost:3000';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notifications: NotificationsService,
    private popupService: PopupService
  ) {
    this.form = this.fb.group({
      walletID: ['', Validators.required],
      categoryID: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      isRecurring: [false],
      recurrenceFrequency: ['']
    });

    this.form.get('isRecurring')?.valueChanges.subscribe((isRecurring: boolean) => {
      const frequencyControl = this.form.get('recurrenceFrequency');
      if (isRecurring) {
        frequencyControl?.setValidators([Validators.required]);
      } else {
        frequencyControl?.clearValidators();
        frequencyControl?.setValue('');
      }
      frequencyControl?.updateValueAndValidity();
    });
    
    this.walletIdFromParams = this.route.snapshot.paramMap.get('id');
    this.loadWallets();
    this.loadCategories();
  }

  loadWallets() {
    from(this.api.getAll(`${this.apiUrl}/wallets`)).subscribe({
      next: (response: any) => {
        this.wallets = response.data || [];
        
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
    this.originalTransaction = { ...transaction };
    
    const formType = transaction.type === 'bevétel' ? 'income' : 'expense';
    const isRecurring = Boolean(transaction.isRecurring) || false;
    
    this.form.patchValue({
      walletID: transaction.walletID,
      categoryID: transaction.categoryID,
      amount: transaction.amount,
      type: formType,
      isRecurring: isRecurring,
      recurrenceFrequency: transaction.recurrenceFrequency || ''
    });
    
    this.showRecurrenceOptions = isRecurring;
    if (isRecurring) {
      this.form.get('recurrenceFrequency')?.setValidators([Validators.required]);
      this.form.get('recurrenceFrequency')?.updateValueAndValidity();
    }
  }

  onRecurringChange() {
    this.showRecurrenceOptions = this.form.get('isRecurring')?.value || false;
    if (!this.showRecurrenceOptions) {
      this.form.patchValue({ recurrenceFrequency: '' });
    }
  }

  onSubmit() {
    if (this.form.get('isRecurring')?.value && !this.form.get('recurrenceFrequency')?.value) {
      this.form.get('recurrenceFrequency')?.markAsTouched();
      this.notifications.show('error', 'Hiba', 'Ha ismétlődő tranzakciót jelölsz be, válassz gyakoriságot is!');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    
    const type = value.type === 'income' ? 'bevétel' : 'kiadás';
    const newAmount = Number(value.amount ?? 0);
    const newWalletID = value.walletID ?? '';
    
    const isRecurring = Boolean(value.isRecurring);
    const recurrenceFrequency = value.recurrenceFrequency || null;
    
    const payload: any = {
      walletID: newWalletID,
      categoryID: value.categoryID ?? '',
      amount: newAmount,
      type: type,
      isRecurring: isRecurring ? 1 : 0,
      date: value.date ? new Date(value.date).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    if (isRecurring && recurrenceFrequency) {
      payload.recurrenceFrequency = recurrenceFrequency;
      const nextDate = new Date();
      if (recurrenceFrequency === 'daily') {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (recurrenceFrequency === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (recurrenceFrequency === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      payload.nextRecurrenceDate = nextDate.toISOString().slice(0, 19).replace('T', ' ');
      if (!this.isEditMode && !this.originalTransaction?.id) {
        payload.originalTransactionID = null;
      } else if (this.isEditMode && this.originalTransaction?.originalTransactionID) {
        payload.originalTransactionID = this.originalTransaction.originalTransactionID;
      }
    } else {
      payload.recurrenceFrequency = null;
      payload.nextRecurrenceDate = null;
      payload.originalTransactionID = null;
    }

    this.updateWalletBalance(type, newAmount, newWalletID);

    const request = this.isEditMode && this.editingTransactionId
      ? from(this.api.patch(`${this.apiUrl}/transactions`, this.editingTransactionId as any, payload))
      : from(this.api.post(`${this.apiUrl}/transactions`, payload));

    request.subscribe({
      next: () => {
        this.loading = false;
        const message = this.isEditMode ? 'Tranzakció frissítve' : 'Tranzakció felvéve';
        this.notifications.show('success', 'Siker', message);
        
        this.form.reset();
        this.isEditMode = false;
        this.editingTransactionId = null;
        this.originalTransaction = null;
        this.showRecurrenceOptions = false;
      },
      error: () => {
        this.loading = false;
        const message = this.isEditMode ? 'Nem sikerült frissíteni a tranzakciót' : 'Nem sikerült felvenni a tranzakciót';
        this.notifications.show('error', 'Hiba', message);
      }
    });
  }

  private updateWalletBalance(newType: string, newAmount: number, newWalletID: string) {
    if (this.isEditMode && this.originalTransaction) {
      const originalAmount = this.originalTransaction.amount;
      const originalType = this.originalTransaction.type;
      const originalWalletID = this.originalTransaction.walletID;
      const walletChanged = originalWalletID !== newWalletID;
      
      if (walletChanged) {
        const originalWallet = this.wallets.find(w => w.id === originalWalletID);
        if (originalWallet) {
          if (originalType === 'bevétel') {
            originalWallet.balance -= originalAmount;
          } else {
            originalWallet.balance += originalAmount;
          }
          from(this.api.patch(`${this.apiUrl}/wallets`, originalWalletID as any, { balance: originalWallet.balance })).subscribe({
            next: () => {
              this.checkBalanceAndNotify(originalWallet);
            }
          });
        }
        
        const newWallet = this.wallets.find(w => w.id === newWalletID);
        if (newWallet) {
          if (newType === 'bevétel') {
            newWallet.balance += newAmount;
          } else {
            newWallet.balance -= newAmount;
          }
          from(this.api.patch(`${this.apiUrl}/wallets`, newWalletID as any, { balance: newWallet.balance })).subscribe({
            next: () => {
              this.checkBalanceAndNotify(newWallet);
            }
          });
        }
      } else {
        const wallet = this.wallets.find(w => w.id === newWalletID);
        if (wallet) {
          if (originalType === 'bevétel') {
            wallet.balance -= originalAmount;
          } else {
            wallet.balance += originalAmount;
          }
          
          if (newType === 'bevétel') {
            wallet.balance += newAmount;
          } else {
            wallet.balance -= newAmount;
          }
          
          from(this.api.patch(`${this.apiUrl}/wallets`, newWalletID as any, { balance: wallet.balance })).subscribe({
            next: () => {
              this.checkBalanceAndNotify(wallet);
            }
          });
        }
      }
    } else {
      const wallet = this.wallets.find(w => w.id === newWalletID);
      if (wallet) {
        if (newType === 'bevétel') {
          wallet.balance += newAmount;
        } else {
          wallet.balance -= newAmount;
        }
        from(this.api.patch(`${this.apiUrl}/wallets`, newWalletID as any, { balance: wallet.balance })).subscribe({
          next: () => {
            this.checkBalanceAndNotify(wallet);
          }
        });
      }
    }
  }

  private checkBalanceAndNotify(wallet: Wallet) {
    from(this.api.getAll(`${this.apiUrl}/user_notification_preferences`)).subscribe({
      next: (response: any) => {
        const prefs: NotificationPreferences = response.data?.[0] || {
          lowBalanceThreshold: 1000,
          negativeBalanceEnabled: true,
          highBalanceThreshold: 10000000
        };

        if (prefs.negativeBalanceEnabled && wallet.balance < 0) {
          this.createNotification('info', 'Negatív egyenleg', `A(z) ${wallet.name} pénztárcád egyenlege ${wallet.balance} Ft.`);
        } else if (wallet.balance < prefs.lowBalanceThreshold) {
          this.createNotification('warning', 'Alacsony egyenleg', `A(z) ${wallet.name} pénztárcád egyenlege ${wallet.balance} Ft, ami ${prefs.lowBalanceThreshold} Ft alatt van.`);
        } else if (wallet.balance > prefs.highBalanceThreshold) {
          this.createNotification('info', 'Túl sok pénzed van. A napokban meg fog keresni a NAV.', `A(z) ${wallet.name} pénztárcád egyenlege ${wallet.balance} Ft, ami ${prefs.highBalanceThreshold} Ft felett van.`);
        }

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: () => {
        if (wallet.balance < 0) {
          this.createNotification('info', 'Negatív egyenleg', `A(z) ${wallet.name} pénztárcád egyenlege ${wallet.balance} Ft.`);
        } else if (wallet.balance < 1000) {
          this.createNotification('warning', 'Alacsony egyenleg', `A(z) ${wallet.name} pénztárcád egyenlege ${wallet.balance} Ft, ami 1000 Ft alatt van.`);
        } else if (wallet.balance > 10000000) {
          this.createNotification('info', 'Túl sok pénzed van. A napokban meg fog keresni a NAV.', `A(z) ${wallet.name} pénztárcád egyenlege ${wallet.balance} Ft, ami 10 000 000 Ft felett van.`);
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  }

  private createNotification(severity: string, title: string, message: string) {
    const notification = {
      severity: severity,
      title: title,
      message: message
    };
    from(this.api.post(`${this.apiUrl}/notifications`, notification)).subscribe({
      next: () => {
        this.popupService.show();
      },
      error: () => {
      }
    });
  }

  cancelEdit() {
    this.form.reset();
    this.isEditMode = false;
    this.editingTransactionId = null;
    this.originalTransaction = null;
    this.showRecurrenceOptions = false;
  }
}
