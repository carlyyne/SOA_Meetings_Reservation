import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/auth/users';

  constructor(private http: HttpClient) {}

  // User registration
  signup(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }
  
  // Update user connected information
  updateUser(updateData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, updateData, { withCredentials: true});
  }

  // Delete the connected user
  deleteUser(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}`, { withCredentials: true});
  }

  // Get all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl,{ withCredentials: true});
  }

  // Get all users except the connected user
  getUsersExceptCurrent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`, {
      withCredentials: true, // Assurez-vous que les cookies sont envoyés
    });
  }

  // Get the connected user
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }

  // Validate the old password: user password update
  validatePassword(oldPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/validate-password`, { oldPassword }, { withCredentials: true});
  }

  // Get user by id
  getUserById(userId: string): Observable<any> {
    console.log('1');
  
    return this.http.get<any>(`${this.apiUrl}/${userId}`,{ withCredentials: true});
  }

  getUserByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/name/${name}`,{ withCredentials: true});
  }
}