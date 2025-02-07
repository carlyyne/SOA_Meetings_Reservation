import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting } from '@ng-mf/data-access-user'

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private apiUrl = 'http://localhost:8080/meeting'; // Adapter l'URL si nécessaire

  constructor(private http: HttpClient) {}

  // New meeting
  create(formDataCreate: any): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, formDataCreate, { withCredentials: true});
  }

  // Get meeting by id
  findOneById(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/${id}`, { withCredentials: true});
  }

  // Update meeting
  update(id: string, formDataUpdate: any): Observable<Meeting> {
    console.log(formDataUpdate);
    return this.http.put<Meeting>(`${this.apiUrl}/${id}`, formDataUpdate, { withCredentials: true});
  }

  // Cancel a meeting
  cancel(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { withCredentials: true});
  }

  // Get all meetings created by the connected user
  getMeetingsCreatedByUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/created`, { withCredentials: true});
  }

  // Get all meetings where the connected user is a participant
  getMeetingsWhereUserIsParticipant(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/participant`,{ withCredentials: true});
  }

  // Get all meetings
  getAllMeetings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`,{ withCredentials: true});
  }
   
}