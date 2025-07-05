import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FilterAccountsActions } from './filter-accounts.actions';
import {
  catchError,
  filter,
  first,
  map,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { ProfileService } from '../../../../data/services/profile.service';
import { Store } from '@ngrx/store';
import { selectSearchFormValue } from './filter-accounts.reducer';
import { Subscribers } from '../../../../data/interfces/subscribers.interfase';
import { Profile } from '../../../../data/interfces/profile.interface';
import { selectSubscriptionsState } from '../../../../data/subscriptionsStore/subscriptions.reducer';

export const FilterAccountsEffects = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    profileService = inject(ProfileService)
  ) => {
    let subscriptions: Subscribers<Profile>;
    store
      .select(selectSubscriptionsState)
      .pipe(filter((v) => !!v))
      .subscribe((v) => (subscriptions = v));

    return actions$.pipe(
      ofType(FilterAccountsActions.filterAccounts),

      switchMap(({ searchFormValue }) => {
        return profileService.getAccounts(searchFormValue);
      }),
      map((accounts) => {
        for (let sub of subscriptions.items as Profile[]) {
          accounts = {
            ...(accounts as Subscribers<Profile>),
            items: [
              ...(accounts.items as Profile[]).map((v) =>
                v.id === sub.id ? (v = sub) : v
              ),
            ],
          };
        }
        return FilterAccountsActions.filterAccountsSuccess({ accounts });
      }),
      catchError((err) => {
        return of(FilterAccountsActions.filterAccountsFailure({ errors: err }));
      })
    );
  },
  { functional: true }
);
