import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntryComponentAuth } from './app/remote-entry/entry.component';

bootstrapApplication(RemoteEntryComponentAuth, appConfig).catch((err) =>
  console.error(err)
);
