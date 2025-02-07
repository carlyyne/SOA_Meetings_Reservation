import { Route } from '@angular/router';
import { RemoteEntryComponentRoom } from './entry.component';
import { AddRoomComponent } from '../add-room/add-room.component';
import { EditRoomComponent } from '../edit-room/edit-room.component';

export const remoteRoutes: Route[] = [
  { path: '', component: RemoteEntryComponentRoom},
  { path: 'add', component: AddRoomComponent },
  { path: 'edit/:name', component: EditRoomComponent },
];