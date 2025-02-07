import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntryComponentMeeting } from './app/remote-entry/entry.component';

bootstrapApplication(RemoteEntryComponentMeeting, appConfig).catch((err) =>
  console.error(err)
);
