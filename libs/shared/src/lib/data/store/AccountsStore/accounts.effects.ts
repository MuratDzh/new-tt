import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../services/profile-service/profile.service';
import { AccountsActions } from './accounts.actions';
import {catchError, first, map, of, switchMap, take, withLatestFrom} from 'rxjs';
import { Store } from '@ngrx/store';

import { Subscribers } from '../../../../../../interfaces/src/lib/subscribers/subscribers.interfase';
import { selectSubscriptionsState } from '@tt/shared';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';
import {selectPage, selectSize} from "./accounts.reducer";

export const GetAllAccountsEffects = createEffect(
  (
    actions$ = inject(Actions),
    profileService = inject(ProfileService),
    store = inject(Store)
  ) => {
    let subscriptions: Profile[] | null;

    store
      .select(selectSubscriptionsState)
      .pipe(map((v) => v.items))
      .subscribe((v) => (subscriptions = v));

    return actions$.pipe(
      ofType(AccountsActions.loadAllAccounts,
        AccountsActions.setPage),
      withLatestFrom(
        store.select(selectPage),
        store.select(selectSize)
      ),
      switchMap(([_,page,size]) => {
        return profileService.getAccounts({page,size});
      }),
      map((acc) => {
        let updatedAccounts: Subscribers<Profile>;

        if(subscriptions) {
          for (let sub of subscriptions) {
            acc.items
              ? acc.items?.map((v) =>
                v.id === sub.id ? (v.isSubscribed = true) : v
              )
              : acc.items;
          }
        }
        console.log('ACC', acc);
        return AccountsActions.loadAllAccountsSuccess({ accounts: acc });
      }),
      catchError((err) => {
        return of(AccountsActions.loadAllAccountsFealure({ errors: err }));
      })
    );
  },
  { functional: true }
);
