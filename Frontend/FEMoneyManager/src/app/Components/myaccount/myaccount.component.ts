import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './myaccount.component.html',
  styleUrl: './myaccount.component.scss'
})
export class MyaccountComponent implements OnInit {
  userProfile = {
    fullName: 'Kovács János',
    email: 'janos.kovacs@gmail.com',
    phone: '+36 30 123 4567',
    birthDate: '1990-05-15',
    username: 'janos123'
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  userStats = {
    totalTransactions: 156,
    totalWallets: 3,
    memberSince: '2023. január'
  };

  ngOnInit() {
    // TODO: Load user data from API
    this.loadUserProfile();
  }

  loadUserProfile() {
    // TODO: Implement API call to load user profile
    console.log('Loading user profile...');
  }

  saveProfile() {
    // TODO: Implement API call to save profile
    console.log('Saving profile:', this.userProfile);
    // Show success message
    alert('Profil sikeresen mentve!');
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Az új jelszavak nem egyeznek!');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('Az új jelszó legalább 6 karakter hosszú legyen!');
      return;
    }

    // TODO: Implement API call to change password
    console.log('Changing password...');
    alert('Jelszó sikeresen módosítva!');
    
    // Clear password fields
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  exportData() {
    // TODO: Implement data export functionality
    console.log('Exporting user data...');
    alert('Adatok exportálása elkezdődött. Emailben küldjük el a fájlt.');
  }

  deleteAccount() {
    const confirmed = confirm(
      'Biztosan törölni szeretné a fiókját? Ez a művelet visszavonhatatlan!\n\n' +
      'Minden adata (tranzakciók, pénztárcák, statisztikák) véglegesen törlésre kerül.'
    );

    if (confirmed) {
      const doubleConfirmed = confirm(
        'Utolsó figyelmeztetés!\n\n' +
        'A fiók törlése után nem lehet helyreállítani az adatokat.\n' +
        'Biztosan folytatja?'
      );

      if (doubleConfirmed) {
        // TODO: Implement API call to delete account
        console.log('Deleting account...');
        alert('Fiók törlése folyamatban...');
      }
    }
  }
}
