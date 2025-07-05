import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrentUserActions } from './current-user.actions';
import { ProfileService } from '../services/profile.service';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { ProfileActions } from '../../pages/profile-page/profileStore/profile.actions';

export const CurrentUserEffects = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
    return actions$.pipe(
      ofType(CurrentUserActions.getMe),
      exhaustMap(() => {
        return profileService.getMe();
      }),
      map((v) => {
        return CurrentUserActions.getMeSuccess({ me: v });
      }),
      catchError(() => of(CurrentUserActions.getMeSuccess))
    );
  },
  { functional: true }
);

export const CurrentUsertoProfileEffects = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(CurrentUserActions.getMeSuccess),
      //@ts-ignore
      concatMap((v) => {
        return store.dispatch(
          ProfileActions.loadProfileSuccess({ profile: v.me })
        );
      })
    );
  },
  { dispatch: false, functional: true }
);
