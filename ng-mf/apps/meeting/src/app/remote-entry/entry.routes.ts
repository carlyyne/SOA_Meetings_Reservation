import { Route } from '@angular/router';
import { RemoteEntryComponentMeeting } from './entry.component';
import { AddMeetingComponent } from '../add-meeting/add-meeting.component';
import { EditMeetingComponent } from '../edit-meeting/edit-meeting.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntryComponentMeeting },
  { path: 'add', component: AddMeetingComponent },
  { path: 'edit/:id', component: EditMeetingComponent },
];
