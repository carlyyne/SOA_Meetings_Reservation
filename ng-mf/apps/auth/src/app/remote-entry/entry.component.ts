import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, UserService } from '@ng-mf/data-access-user';

@Component({
  selector: 'ng-mf-auth-entry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './remote-entry.component.html',
  styleUrls: ['./remote-entry.component.css', './../../styles.css'],
})
export class RemoteEntryComponentAuth {
  submit = false;
  errorConnexion: any | undefined;
  isSignup = false; // false = login, true = signup

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.submit = false;
    this.errorConnexion = undefined;
  }

  onSubmit(f: NgForm) {
    this.submit = true;
    this.errorConnexion = undefined;
    
    const formData = this.isSignup
      ? { username: f.value.username, email: f.value.email, password: f.value.password }
      : { username: f.value.username, password: f.value.password };
    
    if (this.isSignup) {
      if (f.value.username && f.value.email && f.value.password) {
        this.userService.signup(formData).subscribe(
          () => this.isSignup = false,
          error => (this.errorConnexion = error.error)
        );
      }
    } else {
      if (f.value.username && f.value.password) {
        this.authService.login(formData).subscribe(
          () => this.router.navigate(['']),
          error => {
            console.error('Connexion error :', error.error.message);
            if (error.error.message === 'Document not found.') {
              this.errorConnexion = { message: 'User not found.' };
            }
            if (error.error.message === 'Credentials are not valid.') {
              this.errorConnexion = { message: 'Wrong password.' };
            }
            else { this.errorConnexion = error.error;}
          }
        );
      }
    }
  }

  errorConnexionExist() {
    return this.errorConnexion !== undefined;
  }
}
