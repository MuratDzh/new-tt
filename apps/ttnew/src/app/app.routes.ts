import { Routes } from '@angular/router';
import { LayoutComponent } from '../../../../libs/layout/src/lib/feature-layout/layout/layout.component';
import { ProfilePageComponent } from '../../../../libs/profile/src/lib/feature-profile-page/profile-page.component';
import { getProfileResolver } from '../../../../libs/shared/src/lib/data/store/profileStore/profile.resolver';
import { getPostResolver } from '../../../../libs/posts/src/lib/data/store/postStore/post.resolver';
import { getSubscribersResolver } from '../../../../libs/shared/src/lib/data/store/subscribersStore/subscribers.resolver';
import { SubscriptionsResolver } from '../../../../libs/shared/src/lib/data/store/subscriptionsStore/subscriptions.resolver';
import { SettingsComponent } from '../../../../libs/settings/src/lib/feature-settings-page/settings.component';
import { SearchComponent } from '../../../../libs/search/src/lib/feature-search-page/search/search.component';
import { getAllAccountsResolver } from '../../../../libs/shared/src/lib/data/store/AccountsStore/accounts.resolver';
import { ChatsRoutes } from '../../../../libs/chat/src/lib/feature-chat-page/chats.routes';
import { CurrentUserResolver } from '../../../../libs/shared/src/lib/data/store/currentUserStore/current-user.resolver';
import { CanActivateAuth } from '../../../../libs/tt-auth/src/lib/tt-auth/access.guard';
import { LoginComponent } from './../../../../libs/login/src';


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
