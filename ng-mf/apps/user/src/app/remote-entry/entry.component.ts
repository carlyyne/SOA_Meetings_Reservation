import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@ng-mf/data-access-user';
import { AuthService } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-mf-user-entry',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './remote-entry.component.html',
  styleUrls: ['./remote-entry.component.css','./../../styles.css'],
  // styleUrls: ['./remote-entry.component.css'],

})

export class RemoteEntryComponent implements OnInit {
  submit = false;
  errorConnexion : any | undefined;
  currentUser: any = {};
  successMessage: string | null = null; 
  errorMessage: string | null = null;
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.currentUser = user;
        console.log(user);
      },
      (err) => {
        console.error('Erreur lors du chargement des données utilisateur', err);
      }
    );
  }

  onSubmit(f: NgForm): void {
    const formData = f.value;
    this.successMessage = null;
    this.errorMessage = null;

    if (formData.old_password || formData.new_password) {
      if (!formData.old_password || !formData.new_password) {
        this.errorMessage = 'Both old and new passwords are required to update the password.';
        return;
      }

      this.userService.validatePassword(formData.old_password).subscribe(
        (isValid) => {
          if (isValid) {
            this.updateUserProfile(formData);
          } else {
            this.errorMessage = 'The old password is incorrect.';
          }
        },
        (err) => {
          console.error('Erreur lors de la validation du mot de passe', err);
          this.errorMessage = 'An error occurred while validating your password.';
        }
      );
    } else {
      this.updateUserProfile(formData);
    }
  }

  private updateUserProfile(formData: any): void {
    const updateData: any = {};

    if (formData.username) {
      updateData.username = formData.username;
    }

    if (formData.email) {
      updateData.email = formData.email;
    }

    if (formData.new_password) {
      updateData.password = formData.new_password;
    }

    this.userService.updateUser(updateData).subscribe(
      () => {
        this.successMessage = 'Profile updated successfully.';
        this.loadUserProfile();
      },
      (err) => {
        console.error('Erreur lors de la mise à jour du profil', err);
        this.errorMessage = 'Failed to update the profile. Please try again.';
      }
    );
  }

  errorConnexionExist() {
    return this.errorConnexion !== undefined;
  }
}
