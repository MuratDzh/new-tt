import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FilterAccountsActions } from './filter-accounts.actions';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';

import { Store } from '@ngrx/store';
import {ProfileService, selectSearchFormValue, selectSubscriptionsState} from '@tt/shared';
import { Profile } from '@tt/interfaces/profile';
import { Subscribers } from '@tt/interfaces/subscribers';
import {selectFilteredPage, selectFilteredSize} from "./filter-accounts.reducer";

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
      ofType(FilterAccountsActions.filterAccounts,
        FilterAccountsActions.setPage),
      withLatestFrom(
        store.select(selectFilteredPage),
        store.select(selectFilteredSize),
        store.select(selectSearchFormValue)
      ),
      switchMap(([ _ ,page,size, searchFormValue]) => {
        console.log('[ searchFormValue ,page,size]',{...searchFormValue, page, size})
        return profileService.getAccounts({...searchFormValue, page, size});
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
