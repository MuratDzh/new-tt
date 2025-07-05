import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../../data/services/profile.service';
import { ProfileActions } from './profile.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectEntities } from './profile.reducer';
import { AccountsActions } from '../../search/AccountsStore/accounts.actions';

export const ProfileEffects = createEffect(
  (
    actions$ = inject(Actions),
    profileService = inject(ProfileService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(ProfileActions.loadProfile),
      switchMap((v) => {
        return profileService.getProfileResolver(v.id);
      }),
      map((v) => {
        store.dispatch(
          ProfileActions.loadCurrentProfileSuccess({ profile: v })
        );

        return ProfileActions.loadProfileSuccess({ profile: v });
      }),
      catchError((err) =>
        of(ProfileActions.loadProfileFailure({ errors: err }))
      )
    );
  },
  {
    functional: true,
  }
);

export const CurrentProfileEffects = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(ProfileActions.loadCurrentProfile),
      tap((v) => console.log('---TAP NEW--', v)),
      switchMap((v) => {
        console.log('---loadCurrentProfile---', v.id);
        return store.select(selectEntities).pipe(map((p) => p[v.id]!));
      }),
      map((v) => {
        return ProfileActions.loadCurrentProfileSuccess({ profile: v });
      }),
      catchError((err) =>
        of(ProfileActions.loadProfileFailure({ errors: err }))
      )
    );
  },
  {
    functional: true,
  }
);
