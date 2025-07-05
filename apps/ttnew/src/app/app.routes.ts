import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { CanActivateAuth } from './auth/access.guard';
import { SettingsComponent } from './pages/settings/settings.component';

import { ChatsRoutes } from './pages/chats/chats.routes';
import { CurrentUserResolver } from './data/currentUserStore/current-user.resolver';
import { getSubscribersResolver } from './data/subscribersStore/subscribers.resolver';
import { getAllAccountsResolver } from './pages/search/AccountsStore/accounts.resolver';
import { getProfileResolver } from './pages/profile-page/profileStore/profile.resolver';
import { getPostResolver } from './pages/profile-page/postStore/post.resolver';
import { SubscriptionsResolver } from './data/subscriptionsStore/subscriptions.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/profile/me', pathMatch: 'full' },
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
