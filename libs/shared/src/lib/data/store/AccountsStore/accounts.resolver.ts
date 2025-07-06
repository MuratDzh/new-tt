import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AccountsActions } from './accounts.actions';
import { Subscribers } from '../../../../../../interfaces/src/lib/subscribers/subscribers.interfase';
import { Profile } from '../../../../../../profile/src/lib/data/interfaces/profile.interface';
import { selectAccounts, selectIsAccountsLoaded } from './accounts.reducer';
import {first, firstValueFrom, tap} from 'rxjs';

export const getAllAccountsResolver: ResolveFn<
  Subscribers<Profile> | boolean
> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  return firstValueFrom(store.pipe(
    select(selectIsAccountsLoaded),
    tap((IsAccountsLoaded) => {

      if (!IsAccountsLoaded) {
        store.dispatch(AccountsActions.loadAllAccounts());
      }

    }),

  ))
};
