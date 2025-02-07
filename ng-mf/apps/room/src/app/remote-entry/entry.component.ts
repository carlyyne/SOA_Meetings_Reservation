import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { RoomService } from '@ng-mf/data-access-user';
import { Room } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ng-mf-room-entry',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    RouterModule,
],
  templateUrl: './remote-entry.component.html',
  styleUrls: ['./remote-entry.component.css', './../../styles.css'],
  // styleUrls: ['./remote-entry.component.css'],

})
export class RemoteEntryComponentRoom implements OnInit {
  rooms: Room[] = [];
  errorMessage: string = '';

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  // Load all rooms
  loadRooms(): void {
    this.roomService.getAllRooms().subscribe(
      (data) => {
        this.rooms = data;
      },
      (error) => {
        this.errorMessage = 'Error loading rooms';
        console.error(error);
      }
    );
  }

  deleteRoom(id: string): void {
    console.log('deleteRoom', id);
    
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(id).subscribe(
        () => {
          this.rooms = this.rooms.filter((room) => room._id !== id);
        },
        (error) => {
          this.errorMessage = 'Error deleting room';
          console.error(error);
        }
      );
    }
  }
}