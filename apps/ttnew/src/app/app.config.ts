import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthTokenInterceptor } from './auth/auth.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as loginEffects from './pages/login/Store/login.effects';
import {
  loginFeatureKey,
  loginReducer,
} from './pages/login/Store/login.reducer';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import * as CurrentUserEffects from './data/currentUserStore/current-user.effects';
import {
  CurrentUserFeatureKey,
  CurrentUserReducer,
} from './data/currentUserStore/current-user.reducer';
import * as getSubscribersEffects from './data/subscribersStore/subscribers.effects';
import {
  getSubscribersFeatureKey,
  getSubscribersReducer,
} from './data/subscribersStore/subscribers.reducer';
import {
  GetAllAccountsFeatureKey,
  GetAllAccountsReducer,
} from './pages/search/AccountsStore/accounts.reducer';
import * as GetAllAccuntsEffects from './pages/search/AccountsStore/accounts.effects';
import * as FilterAccountsEffects from './pages/search/profile-filter/FilterAccountsStore/filter-accounts.effects';
import {
  FilterAccountsFeatureKey,
  FilterAccountsReducer,
} from './pages/search/profile-filter/FilterAccountsStore/filter-accounts.reducer';
import * as ProfileEffects from './pages/profile-page/profileStore/profile.effects';
import {
  ProfileReducer,
  ProfileReducerKey,
} from './pages/profile-page/profileStore/profile.reducer';
import * as PostEffects from './pages/profile-page/postStore/post.effects';
import {
  PostsFromUsersKey,
  PostsFromUsersReducer,
} from './pages/profile-page/postStore/post.reducer';
import * as CurrentUserPostsEffect from './pages/profile-page/myPostStore/currentUserPosts.effects';
import {
  CurrentUserPostsKey,
  CurrentUserPostsReducer,
} from './pages/profile-page/myPostStore/currentUserPosts.reducer';
import * as GetCommentsEffect from './pages/profile-page/commentsStore/comments.effect';
import {
  CommentsFeatureReducer,
  CommentsReducerKey,
} from './pages/profile-page/commentsStore/comments.reducer';
import * as SubscriptionsEffect from './data/subscriptionsStore/subscriptions.effect';
import {
  SubscriptionsFeatureReducerKey,
  SubscriptionsReducer,
} from './data/subscriptionsStore/subscriptions.reducer';

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
