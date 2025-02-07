import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { RoomService } from '@ng-mf/data-access-user';

@Component({
  selector: 'ng-mf-modify-room',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css', './../../styles.css'],
  // styleUrls: ['./edit-room.component.css'],

})
export class EditRoomComponent implements OnInit {
  submit = false;
  errorUpdate : any | undefined;
  room: any = {};
  originalRoom: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    const roomName = this.route.snapshot.paramMap.get('name');
    if (roomName) {
      this.roomService.getRoomByName(roomName).subscribe(
        (data: any) => {
          this.room = { ...data };
          this.originalRoom = { ...data };
        },
        (error: any) => {
          console.error('Erreur lors du chargement de la salle :', error);
        }
      );
    }
  }
  onSubmit(f: NgForm) {    
    this.submit = true;
    
    const updatedResources =
      typeof f.value.resources === 'string' && f.value.resources.trim() !== ''
        ? f.value.resources.split(',').map((r: string) => r.trim())
        : this.originalRoom.resources;
  
    console.log('Original name:', this.originalRoom.name);
    console.log('Name changed:', f.value.name);
    
    const updatedRoom: any = {};
  
    if (f.value.name !== this.originalRoom.name) {
      updatedRoom.name = f.value.name;
    }
  
    if (Number(f.value.capacity) !== this.originalRoom.capacity) {
      updatedRoom.capacity = Number(f.value.capacity);
    }
  
    if (JSON.stringify(updatedResources) !== JSON.stringify(this.originalRoom.resources)) {
      updatedRoom.resources = updatedResources;
    }
  
    console.log('Updated Room:', updatedRoom);
    
    if (Object.keys(updatedRoom).length === 0) {
      console.log('Aucune modification détectée.');
      return;
    }
  
    this.roomService.updateRoom(this.room._id, updatedRoom).subscribe(
      (data: any) => {
        console.log('Room updated successfully:', data);
        this.router.navigateByUrl('/room');
      },
      (error: any) => {
        console.error('Erreur lors de la mise à jour :', error.error.message);
        this.errorUpdate = error.error;
      }
    );
  }

  errorUpdateExist() {
    return this.errorUpdate !== undefined;
  }
}
