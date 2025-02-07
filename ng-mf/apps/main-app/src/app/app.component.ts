import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '@ng-mf/data-access-user';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'ng-mf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './../styles.css'],
  // styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  isLoggedIn$ = this.authService.isUserLoggedIn$;
  userConnected !: User;

  ngOnInit() {
    this.isLoggedIn$
      .pipe(distinctUntilChanged())
      .subscribe(async (loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['/auth']);
        } else {
          this.router.navigate(['']);
        }
      });
  }

  // Méthode de déconnexion
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['auth']);
    });
  }
}