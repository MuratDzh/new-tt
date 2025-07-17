import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../services/profile-service/profile.service';
import { getSubscribersActions } from './subscribers.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SubEntities } from './subscribers.interface';
import { Store } from '@ngrx/store';
import { selectMe } from '../currentUserStore/current-user.reducer';
import { Profile } from '@tt/interfaces/profile';


export const getSubscribersEffects = createEffect(
  (
    actions$ = inject(Actions),
    profileService = inject(ProfileService),
    store = inject(Store)
  ) => {
    let profileId: number;
    let subscribers: SubEntities;
    return actions$.pipe(
      ofType(getSubscribersActions.getSubscribers),
      switchMap(({ id }) => {
        if (id === 'me') {
          store
            .select(selectMe)
            .pipe(tap((v) => console.log('DDDD', v!.id)))
            .subscribe((v) => (profileId = (v as Profile).id));
        } else {
          profileId = id as number;
        }
        console.log('EFFECT, ID,', id);
        return profileService
          .getSubscribersById(profileId)
          .pipe(tap((v) => console.log('ПРОВЕРКА МЕТОДА', v)));
      }),
      map((sub) => {
        console.log('EFFECT, SUB,', sub);
        subscribers = {
          ...JSON.parse(JSON.stringify(sub)),
          idSub: profileId,
          isLoaded: true,
          errors: null,
        };
        console.log('EFFECT, subscribers,', subscribers);
        return getSubscribersActions.getSubscribersSuccess({ subscribers });
      }),
      catchError((err) =>
        of(getSubscribersActions.getSubscribersFeilure({ errors: err }))
      )
    );
  },
  { functional: true }
);
