import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrentUserActions } from './current-user.actions';

import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  of,
  tap
} from 'rxjs';
import { Store } from '@ngrx/store';

import { ProfileService } from '../../services';
import { ProfileActions } from '../profileStore/profile.actions';
import { Profile } from '@tt/interfaces/profile';
import { ActivatedRoute } from '@angular/router';

export const CurrentUserEffects = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService),
  router=inject(ActivatedRoute)) => {
    return actions$.pipe(
      ofType(CurrentUserActions.getMe),
      exhaustMap(() => {
        
        // return router.data.pipe(
        //   map(({ me }) => me),
        //   tap((me) => {
        //     console.log("Я", me);
            
        //     window.localStorage.setItem('me', JSON.stringify(me))
        //   })
        // )


        //   if (window.localStorage.getItem('me')) of(JSON.parse(window.localStorage.getItem('me') as string));
        //     return profileService.getMe();
        // }),
        
        return of(JSON.parse(window.localStorage.getItem('me') as string))
      }),


      // tap((me) => {
      //   console.log("OOOO", me);
      //   window.localStorage.setItem("me", JSON.stringify(me));
       
      // }),
      map((v) => {
        return CurrentUserActions.getMeSuccess({ me: v });
      }),
      catchError(() => {
        console.log("ОШИБКА");
         
        return of(CurrentUserActions.getMeFailure())
      })
    );
  },
  { functional: true }
);

export const CurrentUsertoProfileEffects = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(CurrentUserActions.getMeSuccess),
     
      concatMap(({ me }) => {
       
         store.dispatch(
          ProfileActions.loadProfileSuccess({ profile: me })
         );
        return of(null)
      })
    );
  },
  { dispatch: false, functional: true }
);
