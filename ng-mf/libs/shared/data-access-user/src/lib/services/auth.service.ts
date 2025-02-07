import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlAuth = 'http://localhost:8080/auth';

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isUserLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  checkLoginStatus(): void {
    const token = this.getAuthToken()
    if (token) {
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  private getAuthToken(): string | null {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('Authentication='));
  
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  
    return null;
  }

  login(formData: any): Observable<any> {
    const credentials = formData
    return this.http.post(`${this.apiUrlAuth}`, credentials, {
      withCredentials: true,
    }).pipe(
      tap((response: any) => {
        this.isLoggedInSubject.next(true);
        this.router.navigateByUrl('');}
      )
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrlAuth}/users/me`, { withCredentials: true });
  }


  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrlAuth}/logout`,{}, { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedInSubject.next(false);
      })
    );
  }

}