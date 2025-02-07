import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntryComponentRoom } from './app/remote-entry/entry.component';

bootstrapApplication(RemoteEntryComponentRoom, appConfig).catch((err) =>
  console.error(err)
);
