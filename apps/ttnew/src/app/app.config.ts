import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as loginEffects from '@tt/login/effects';
import { loginFeatureKey, loginReducer } from '@tt/login';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import * as CurrentUserEffects from '@tt/shared/currentuser';
import {
  CurrentUserFeatureKey,
  CurrentUserReducer,
} from '@tt/shared';
import * as getSubscribersEffects from '@tt/shared/subscribers';
import {
  getSubscribersFeatureKey,
  getSubscribersReducer,
} from '@tt/shared';
import {
  GetAllAccountsFeatureKey,
  GetAllAccountsReducer,
} from '@tt/shared';
import * as GetAllAccuntsEffects from '@tt/shared/allaccaunts';
import * as FilterAccountsEffects from '@tt/shared/filteredaccaunts';
import {
  FilterAccountsFeatureKey,
  FilterAccountsReducer,
} from '@tt/shared';
import * as ProfileEffects from '@tt/shared/profile';
import {
  ProfileReducer,
  ProfileReducerKey,
} from '@tt/shared';
import * as PostEffects from '@tt/posts/posteffects';
import {
  PostsFromUsersKey,
  PostsFromUsersReducer,
} from '@tt/posts/posts';
import * as CurrentUserPostsEffect from '@tt/posts/myposteffects';
import {
  CurrentUserPostsKey,
  CurrentUserPostsReducer,
} from '@tt/posts/myposts';
import * as GetCommentsEffect from '@tt/posts/commentseffects';
import {
  CommentsFeatureReducer,
  CommentsReducerKey,
} from '@tt/posts/comments';
import * as SubscriptionsEffect from '@tt/shared/sudscriptions';
import {
  SubscriptionsFeatureReducerKey,
  SubscriptionsReducer,
} from '@tt/shared';
import { AuthTokenInterceptor } from '@tt/tt-auth';

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
      getSubscribersEffects,
      SubscriptionsEffect,
      GetAllAccuntsEffects,
      FilterAccountsEffects,
      ProfileEffects,
      PostEffects,
      CurrentUserPostsEffect,
      GetCommentsEffect,
      CurrentUserEffects,
    ),
    provideRouterStore(),
  ],
};
