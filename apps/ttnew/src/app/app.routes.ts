import { Routes } from '@angular/router';
import { LayoutComponent } from '@tt/layout';
import { ProfilePageComponent } from '@tt/profile';
import { getPostResolver } from '@tt/posts';
import { SettingsComponent } from '@tt/settings';
import { SearchComponent } from '@tt/search';
import { ChatsRoutes } from '@tt/chat';
import {
  CurrentUserResolver,
  getProfileResolver,
  getSubscribersResolver,
  SubscriptionsResolver,
  getAllAccountsResolver,
} from '@tt/shared';
import { CanActivateAuth } from '@tt/tt-auth';
import { LoginComponent } from '@tt/login';






export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/profile/me',
        pathMatch: 'full',
        resolve: {},
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        resolve: {
          profile: getProfileResolver,
          posts: getPostResolver,
          subscribers: getSubscribersResolver,
          subscriptions: SubscriptionsResolver,
        },
      },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'search',
        component: SearchComponent,
        resolve: {
          allAccounts: getAllAccountsResolver,
        },
      },
      {
        path: 'chats',
        loadChildren: () => ChatsRoutes,
      },
    ],
    resolve: {
      me: CurrentUserResolver,
      subscriptions: SubscriptionsResolver,
    },
    canActivate: [CanActivateAuth],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'form',
    loadChildren: () =>
      import('./../app/pages/form/form.routes').then((m) => m.formRoutes),
  },
];
