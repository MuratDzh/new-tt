import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AccountsActions } from './accounts.actions';
import { Subscribers } from '@tt/interfaces/subscribers';
import { Profile } from '@tt/interfaces/profile';
import { selectIsAccountsLoaded } from './accounts.reducer';
import { firstValueFrom, tap } from 'rxjs';

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
