import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AccountsActions } from './accounts.actions';
import { Subscribers } from '../../../data/interfces/subscribers.interfase';
import { Profile } from '../../../data/interfces/profile.interface';
import { selectAccounts, selectIsAccountsLoaded } from './accounts.reducer';
import { first, tap } from 'rxjs';

export const getAllAccountsResolver: ResolveFn<
  Subscribers<Profile> | boolean
> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  return store.pipe(
    select(selectIsAccountsLoaded),
    tap((IsAccountsLoaded) => {
      if (!IsAccountsLoaded) {
        return store.dispatch(AccountsActions.loadAllAccounts());
      }

      return store.select(selectAccounts);
    }),
    first()
  );
};
