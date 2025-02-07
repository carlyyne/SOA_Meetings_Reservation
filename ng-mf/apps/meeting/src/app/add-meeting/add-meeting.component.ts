import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Meeting, MeetingService } from '@ng-mf/data-access-user';
import { RoomService } from '@ng-mf/data-access-user';
import { UserService } from '@ng-mf/data-access-user';
import { AuthService } from '@ng-mf/data-access-user';

@Component({
  selector: 'ng-mf-add-meeting',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css', './../../styles.css'],
  // styleUrls: ['./add-meeting.component.css'],

})

export class AddMeetingComponent implements OnInit {
  submit = false;
  errorAddition: any | undefined;
  rooms: any[] = [];
  participants: any[] = [];
  selectedParticipants: string[] = [];
  isDropdownOpen = false;
  meetingData: Partial<Meeting> = {};


  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private roomService: RoomService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.getParticipants();
    this.getRooms();
  }

  onSubmit(f: NgForm) {
    this.submit = true;

    if (!f.valid || this.selectedParticipants.length === 0) {
      this.errorAddition = { message: 'You must fill all required fields' };
      return;
    }

    const startTime = new Date(`${f.value.date}T${f.value.startTime}`);
    const endTime = new Date(`${f.value.date}T${f.value.endTime}`);

    const newMeeting: any = {
      title: f.value.title,
      roomId: f.value.roomId,
      startTime: startTime,
      endTime: endTime,
      participants: this.selectedParticipants,
      description: f.value.description,
    };    

    console.log('formData:', newMeeting);
  
    this.meetingService.create(newMeeting).subscribe(
      (data: any) => {
        this.router.navigateByUrl('/meeting');
      },
      (error: any) => {
        this.errorAddition = error.error;
      }
    );
  }

  getRooms() {
    this.roomService.getAllRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });    
  }

  getParticipants() {
    this.userService.getUsersExceptCurrent().subscribe((users) => {
      this.participants = users;
    });
  }

  onParticipantSelection(participant: any) {
    if (participant.selected) {
      this.selectedParticipants.push(participant._id);
    } else {
      this.selectedParticipants = this.selectedParticipants.filter(
        (id) => id !== participant._id
      );
    }
  }

  errorAdditionExist() {
    return this.errorAddition !== undefined;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}