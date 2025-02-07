import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Meeting, MeetingService, RoomService, UserService } from '@ng-mf/data-access-user';

@Component({
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterModule,
  ],
  selector: 'ng-mf-meeting-entry',
  templateUrl: './remote-entry.component.html',
  styleUrls: ['./remote-entry.component.css', './../../styles.css'],
  // styleUrls: ['./remote-entry.component.css'],

})
export class RemoteEntryComponentMeeting implements OnInit {
  meetingsCreated: any[] = [];
  meetingsParticipant: any[] = [];
  roomNames: any = {};
  errorMessage: string = '';
  meetingDate = new Date();

  constructor(private meetingService: MeetingService, private userService: UserService, private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadMeetingsCreated();
    this.loadMeetingsParticipant();    
  }

  // Created by user connected
  loadMeetingsCreated(): void {
    this.meetingService.getMeetingsCreatedByUser().subscribe(
      (data) => {
        this.meetingsCreated = this.sortMeetingsChronologically(data);
        this.meetingsCreated.forEach((meeting) => {
            this.roomService.getRoomById(meeting.roomId).subscribe((room) => {
              meeting.roomName = room.name;
            });
            meeting.participantNames = [];
            meeting.participants.forEach((participantId: string) => {              
              this.userService.getUserById(participantId).subscribe((user) => {
                meeting.participantNames.push(user.username);
              });
            });
        });
      },
      (error) => {
        this.errorMessage = 'Error loading meetingsCreated';
        console.error(error);
      }
    );
  }

  // Invitations received by user connected
  loadMeetingsParticipant(): void {
    this.meetingService.getMeetingsWhereUserIsParticipant().subscribe(
      (data) => {
        this.meetingsParticipant = this.sortMeetingsChronologically(data);
        this.meetingsParticipant.forEach((meeting) => {
          this.roomService.getRoomById(meeting.roomId).subscribe((room) => {
            meeting.roomName = room.name;
          });
          this.userService.getUserById(meeting.userId).subscribe((user) => {
            meeting.organizerName = user.username;
          });
          meeting.participantNames = [];
          meeting.participants.forEach((participantId: string) => {              
            this.userService.getUserById(participantId).subscribe((user) => {
              meeting.participantNames.push(user.username);
            });
          });          
      });
      },
      
      (error) => {
        this.errorMessage = 'Error loading meetingsParticipant';
        console.error(error);
      }
    );
  }

  sortMeetingsChronologically(meetings: any[]): any[] {
    return meetings.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
  
      return dateA - dateB;
    });
  }

  cancelMeeting(id: string): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.meetingService.cancel(id).subscribe(
        () => {
          this.meetingsCreated = this.meetingsCreated.filter((meeting) => meeting._id !== id);
        },
        (error) => {
          this.errorMessage = 'Error canceling meeting';
          console.error(error);
        }
      );
    }
  }
}