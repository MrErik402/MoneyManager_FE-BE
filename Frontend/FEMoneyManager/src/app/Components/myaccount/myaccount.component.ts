import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';  
import { User } from '../../Interfaces/User';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { NotificationsService } from '../../Services/notifications.service';
import { SessionService } from '../../Services/session.service';
import axios from 'axios';

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


  constructor(private authService: AuthService, private apiService: ApiService, private notificationsService: NotificationsService, private sessionService: SessionService) {}

  ngOnInit() {
    const cached = this.sessionService.getUser();
    if (cached) {
      this.userProfile = { ...this.userProfile, ...cached };
    }
    this.loadUserProfile();
  }

  loadUserProfile() {
    console.log('Loading user profile...');
    this.authService.me().then((response: any) => {
      if (response) {
        const src = response.data?.user ? response.data.user : response.data;
        this.userProfile.id = src?.id || '';
        this.userProfile.name = src?.name || '';
        this.userProfile.email = src?.email || '';
        this.userProfile.password = '';
        this.userProfile.role = typeof src?.role === 'string' ? { role: src.role } : (src?.role || { role: 'user' });
        this.userProfile.status = src?.status !== undefined ? src.status : true;
        this.sessionService.setUser(src);
        console.log(this.sessionService.getUser());
      }
      
    }).catch((error) => {
      console.error('Error loading user profile:', error);
      this.notificationsService.show('error', 'Hiba', 'Hiba történt a felhasználói adatok betöltése során!');
    });
  }

  saveProfile() {
    if (!this.userProfile.name || !this.userProfile.email) {
      this.notificationsService.show('error', 'Hiba', 'Név és email mezők kitöltése kötelező!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userProfile.email)) {
      this.notificationsService.show('error', 'Hiba', 'Érvényes email címet adjon meg!');
      return;
    }

    axios.patch('http://localhost:3000/auth/update-profile', {
      name: this.userProfile.name,
      email: this.userProfile.email
    }, { withCredentials: true })
    .then((response: any) => {
      if (response.status === 200) {
        if (response.data && response.data.user) {
          this.sessionService.setUser(response.data.user);
        } else {
          const updatedUser = {
            ...this.userProfile,
            name: this.userProfile.name,
            email: this.userProfile.email
          };
          this.sessionService.setUser(updatedUser);
        }
        
        this.loadUserProfile();
        
        this.notificationsService.show('success', 'Siker', 'Profil sikeresen mentve!');
      } else {
        const errorMessage = response.data?.message || 'Sikertelen profil mentés!';
        this.notificationsService.show('error', 'Hiba', errorMessage);
      }
    }).catch((error: any) => {
      console.error('Error saving profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Hiba történt a profil mentése során!';
      this.notificationsService.show('error', 'Hiba', errorMessage);
    });
  }

  changePassword() {
    if (!this.passwordData.currentPassword) {
      this.notificationsService.show('error', 'Hiba', 'Kérjük, adja meg a jelenlegi jelszót!');
      return;
    }

    if (!this.passwordData.newPassword) {
      this.notificationsService.show('error', 'Hiba', 'Kérjük, adja meg az új jelszót!');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.notificationsService.show('error', 'Hiba', 'Az új jelszavak nem egyeznek!');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.notificationsService.show('error', 'Hiba', 'Az új jelszó legalább 6 karakter hosszú legyen!');
      return;
    }

    this.apiService.post('http://localhost:3000/auth/change-password', {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    }).then((response: any) => {
      if (response.status === 200) {
        this.notificationsService.show('success', 'Siker', 'Jelszó sikeresen módosítva!');
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } else {
        const errorMessage = response.data?.message || 'Sikertelen jelszó módosítás!';
        this.notificationsService.show('error', 'Hiba', errorMessage);
      }
    }).catch((error: any) => {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Hiba történt a jelszó módosítása során!';
      this.notificationsService.show('error', 'Hiba', errorMessage);
    });
  }


  deleteAccount() {
    const confirmed = confirm(
      'Biztosan törölni szeretné a fiókját? Ez a művelet visszavonhatatlan!\n\n' +
      'Minden adata (tranzakciók, pénztárcák, statisztikák) véglegesen törlésre kerül.'
    );

    if (!confirmed) {
      return;
    }

    const doubleConfirmed = confirm(
      'Utolsó figyelmeztetés!\n\n' +
      'A fiók törlése után nem lehet helyreállítani az adatokat.\n' +
      'Biztosan folytatja?'
    );

    if (!doubleConfirmed) {
      this.notificationsService.show('info', 'Mégse', 'Fiók törlése megtagadva!');
      return;
    }

    axios.delete('http://localhost:3000/auth/delete-account', {
      withCredentials: true
    })
    .then((response: any) => {
      if (response.status === 200) {
        this.notificationsService.show('success', 'Siker', 'Fiók sikeresen törölve!');
        this.sessionService.clearUser();
        setTimeout(() => {
          window.location.href = '/home';
        }, 2000);
      } else {
        const errorMessage = response.data?.message || 'Sikertelen fiók törlés!';
        this.notificationsService.show('error', 'Hiba', errorMessage);
      }
    }).catch((error: any) => {
      console.error('Error deleting account:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Hiba történt a fiók törlése során!';
      this.notificationsService.show('error', 'Hiba', errorMessage);
    });
  }
}
