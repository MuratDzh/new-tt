import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../../data/services/profile.service';
import { AccountsActions } from './accounts.actions';
import { catchError, first, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Profile } from '../../../data/interfces/profile.interface';
import { Subscribers } from '../../../data/interfces/subscribers.interfase';
import { selectSubscriptionsState } from '../../../data/subscriptionsStore/subscriptions.reducer';

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
      ofType(AccountsActions.loadAllAccounts),

      switchMap(() => {
        return profileService.getAccounts();
      }),
      map((acc) => {
        let updatedAccounts: Subscribers<Profile>;

        console.log('subscriptions', subscriptions);

        for (let sub of subscriptions!) {
          acc.items
            ? acc.items?.map((v) =>
                v.id === sub.id ? (v.isSubscribed = true) : v
              )
            : acc.items;
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
