import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';  
import { User } from '../../Interfaces/User';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './myaccount.component.html',
  styleUrl: './myaccount.component.scss'
})
export class MyaccountComponent implements OnInit {
  userProfile: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: { role: 'user' },
    status: true
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };


  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    // TODO: Load user data from API
    this.loadUserProfile();
  }

  loadUserProfile() {
    console.log('Loading user profile...');
    this.authService.me().then((response: any) => {
      if (response && response.data) {
        this.userProfile.id = response.data.id || '';
        this.userProfile.name = response.data.name || '';
        this.userProfile.email = response.data.email || '';
        this.userProfile.password = response.data.password || '';
        this.userProfile.role = response.data.role || { role: 'user' };
        this.userProfile.status = response.data.status !== undefined ? response.data.status : true;
      }
    }).catch((error) => {
      console.error('Error loading user profile:', error);
      alert('Hiba történt a felhasználói adatok betöltése során!');
    });
  }

  saveProfile() {
    // TODO: Implement API call to save profile
    console.log('Saving profile:', this.userProfile);
    // Show success message
    alert('Profil sikeresen mentve!');
  }

  changePassword() {
    if (!this.passwordData.currentPassword) {
      alert('Kérjük, adja meg a jelenlegi jelszót!');
      return;
    }

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
        this.apiService.delete('/users', parseInt(this.userProfile.id)).then((response: any) => {
          console.log(response);
          if (response.status === 200) {
            alert('Fiók sikeresen törölve!');
          } else {
            alert('Sikertelen fiók törlés!');
          }
        });
      } else {
        alert('Fiók törlése megtagadva!');
      }
    }
  }
}
