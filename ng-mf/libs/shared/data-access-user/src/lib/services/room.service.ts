import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '@ng-mf/data-access-user';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrlRoom = "http://localhost:8080/room";
  
  constructor(private http: HttpClient) {}

  // Create new room
  create(formData: any): Observable<Room> {
    return this.http.post<any>(this.apiUrlRoom, formData, { withCredentials: true});
  }

  // Get all rooms
  getAllRooms(): Observable<Room[]> {
    return this.http.get<any[]>(`${this.apiUrlRoom}`, { withCredentials: true});
  }

  // get a room by id
  getRoomById(id: string): Observable<Room> {
    return this.http.get<any>(`${this.apiUrlRoom}/${id}`, { withCredentials: true});
  }

  // Update a room
  updateRoom(id: string, formData: any): Observable<Room> {
    return this.http.put<any>(`${this.apiUrlRoom}/${id}`, formData, { withCredentials: true});
  }

  // Delete a room
  deleteRoom(id: string): Observable<void> {  
    return this.http.delete<void>(`${this.apiUrlRoom}/${id}`, { withCredentials: true});
  }

  // Get room by name
  getRoomByName(name: string): Observable<Room> {
    return this.http.get<any>(`${this.apiUrlRoom}/name/${name}`, { withCredentials: true});
  }
}