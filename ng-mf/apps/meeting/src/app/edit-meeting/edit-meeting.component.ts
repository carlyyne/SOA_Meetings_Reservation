import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MeetingService } from '@ng-mf/data-access-user';
import { RoomService } from '@ng-mf/data-access-user';
import { UserService } from '@ng-mf/data-access-user';
import { AuthService } from '@ng-mf/data-access-user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ng-mf-edit-meeting',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css', './../../styles.css'],
  // styleUrls: ['./edit-meeting.component.css'],
})

export class EditMeetingComponent implements OnInit {
  userId: any;
  meetingId: string | null = null;
  meetingData: any = {};
  originalMeeting: any = {};
  currentUser: any;
  submit = false;
  errorAddition: any | undefined;
  rooms: any[] = [];
  participants: any[] = [];
  selectedParticipants: string[] = [];
  selectedParticipantsId: string[] = [];
  isDropdownOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private roomService: RoomService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.currentUser = user;
        this.userId = user._id;
        this.getParticipants();
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
      }
    );
    this.getRooms();
    this.meetingId = this.route.snapshot.paramMap.get('id');

    if (this.meetingId) {
      this.loadMeeting(this.meetingId);
    }    
  }

  loadMeeting(id: string) {
    this.meetingService.findOneById(id).subscribe((data) => {
      console.log('Raw Meeting Data:', data); // Vérifier la structure des données
      this.meetingData = { ...data };
      this.originalMeeting = { ...data };
      data.participants.forEach((participant: string) => {
        this.userService.getUserById(participant).subscribe((user) => {
          this.selectedParticipants.push(user.username);
        });
      });
      this.meetingData.participants = this.selectedParticipants;
      this.originalMeeting.participants = this.selectedParticipants;

      this.meetingData.date = data.startTime ? new Date(data.startTime).toISOString().split('T')[0] : '';
      this.originalMeeting.date = data.startTime ? new Date(data.startTime).toISOString().split('T')[0] : '';

      this.roomService.getRoomById(data.roomId).subscribe((room) => {
        this.meetingData.roomName = room ? room.name : 'Unknown Room';
        this.originalMeeting.roomName = room ? room.name : 'Unknown Room';
      });
      this.meetingData.startTime = data.startTime 
        ? new Date(data.startTime).toISOString().substring(11, 16) 
        : '';
      this.meetingData.endTime = data.endTime 
        ? new Date(data.endTime).toISOString().substring(11, 16) 
        : '';
      this.originalMeeting.startTime = data.startTime 
        ? new Date(data.startTime).toISOString().substring(11, 16) 
        : '';
      this.originalMeeting.endTime = data.endTime 
        ? new Date(data.endTime).toISOString().substring(11, 16) 
        : '';
    }, (error) => {
      console.error('Error fetching meeting data:', error);
    });
  }

  onSubmit(f: NgForm) {
    this.submit = true;    
    const startTime = new Date(`${f.value.date}T${f.value.startTime}`);
    const endTime = new Date(`${f.value.date}T${f.value.endTime}`);

    // for (const participant of this.selectedParticipants) {
    //   this.userService.getUserByName(participant).subscribe((user) => {
    //     this.selectedParticipantsId.push(user._id);
    //   });
    // }
    const participantObservables = this.selectedParticipants.map(participant => 
      this.userService.getUserByName(participant)
    );
    forkJoin(participantObservables).subscribe(users => {
      const selectedParticipantsId = users.map(user => user._id);
  
      const updatedMeeting: any = {
        id: this.meetingData._id,
        title: f.value.title,
        description: f.value.description,
        userId: this.currentUser._id,
        startTime: startTime,
        endTime: endTime,
        participants: selectedParticipantsId,
      };
  
      this.roomService.getRoomByName(f.value.roomName).subscribe((room) => {
        updatedMeeting.roomId = room._id;
  
        console.log('updatedMeeting:', updatedMeeting);
        
        this.meetingService.update(this.meetingData._id, updatedMeeting).subscribe(
          (data: any) => {
            console.log('Meeting updated successfully:', data);
            this.router.navigateByUrl('/meeting');
          },
          (error: any) => {
            this.errorAddition = error.error;
          }
        );
      });
    });
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