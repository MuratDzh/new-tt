import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as loginEffects from './../../../../libs/login/src/lib/data/login-store/login.effects';
import { loginFeatureKey, loginReducer } from './../../../../libs/login/src/lib/data/login-store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import * as CurrentUserEffects from './../../../../libs/shared/src/lib/data/store/currentUserStore/current-user.effects';
import {
  CurrentUserFeatureKey,
  CurrentUserReducer,
} from './../../../../libs/shared/src';
import * as getSubscribersEffects from './../../../../libs/shared/src/lib/data/store/subscribersStore/subscribers.effects';
import {
  getSubscribersFeatureKey,
  getSubscribersReducer,
} from './../../../../libs/shared/src';
import {
  GetAllAccountsFeatureKey,
  GetAllAccountsReducer,
} from './../../../../libs/shared/src';
import * as GetAllAccuntsEffects from './../../../../libs/shared/src/lib/data/store/AccountsStore/accounts.effects';
import * as FilterAccountsEffects from './../../../../libs/shared/src/lib/data/store/FilterAccountsStore/filter-accounts.effects';
import {
  FilterAccountsFeatureKey,
  FilterAccountsReducer,
} from './../../../../libs/shared/src';
import * as ProfileEffects from './../../../../libs/shared/src/lib/data/store/profileStore/profile.effects';
import {
  ProfileReducer,
  ProfileReducerKey,
} from './../../../../libs/shared/src';
import * as PostEffects from './../../../../libs/posts/src/lib/data/store/postStore/post.effects';
import {
  PostsFromUsersKey,
  PostsFromUsersReducer,
} from './../../../../libs/posts/src/lib/data/store';
import * as CurrentUserPostsEffect from './../../../../libs/posts/src/lib/data/store/myPostStore/currentUserPosts.effects';
import {
  CurrentUserPostsKey,
  CurrentUserPostsReducer,
} from './../../../../libs/posts/src/lib/data/store';
import * as GetCommentsEffect from './../../../../libs/posts/src/lib/data/store/commentsStore/comments.effect';
import {
  CommentsFeatureReducer,
  CommentsReducerKey,
} from './../../../../libs/posts/src/lib/data/store';
import * as SubscriptionsEffect from './../../../../libs/shared/src/lib/data/store/subscriptionsStore/subscriptions.effect';
import {
  SubscriptionsFeatureReducerKey,
  SubscriptionsReducer,
} from './../../../../libs/shared/src/lib/data/store/subscriptionsStore';
import { AuthTokenInterceptor } from '../../../../libs/tt-auth/src';

// import { PostFeatureReducerKey, PostReducer } from './pages/profile-page/postStore/post.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    provideStore({ router: routerReducer }),
    provideState(loginFeatureKey, loginReducer),
    provideState(GetAllAccountsFeatureKey, GetAllAccountsReducer),
    provideState(getSubscribersFeatureKey, getSubscribersReducer),
    provideState(CurrentUserFeatureKey, CurrentUserReducer),
    provideState(FilterAccountsFeatureKey, FilterAccountsReducer),
    provideState(ProfileReducerKey, ProfileReducer),
    provideState(PostsFromUsersKey, PostsFromUsersReducer),
    provideState(CurrentUserPostsKey, CurrentUserPostsReducer),
    provideState(CommentsReducerKey, CommentsFeatureReducer),
    provideState(SubscriptionsFeatureReducerKey, SubscriptionsReducer),
    // provideState(PostFeatureReducerKey, PostReducer),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(
      loginEffects,
      CurrentUserEffects,
      getSubscribersEffects,
      GetAllAccuntsEffects,
      FilterAccountsEffects,
      ProfileEffects,
      PostEffects,
      CurrentUserPostsEffect,
      GetCommentsEffect,
      SubscriptionsEffect
    ),
    provideRouterStore(),
  ],
};
