import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { AuthGuard } from '@ng-mf/data-access-user';

export const appRoutes: Route[] = [
  {
    path: 'user',
    loadChildren: () =>
      loadRemote<typeof import('user/Routes')>('user/Routes').then(
        (m) => m!.remoteRoutes
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'meeting',
    loadChildren: () =>
      loadRemote<typeof import('meeting/Routes')>('meeting/Routes').then(
        (m) => m!.remoteRoutes
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'room',
    loadChildren: () =>
      loadRemote<typeof import('room/Routes')>('room/Routes').then(
        (m) => m!.remoteRoutes
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemote<typeof import('auth/Routes')>('auth/Routes').then(
        (m) => m!.remoteRoutes
      ),
      canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () =>
      loadRemote<typeof import('meeting/Routes')>('meeting/Routes').then(
        (m) => m!.remoteRoutes
      ),
      canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  }
];
