import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Profile } from '../interfces/profile.interface';
import { inject } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { selectIsMeLoaded, selectMe } from './current-user.reducer';
import { CurrentUserActions } from './current-user.actions';
import { filter, finalize, first, tap } from 'rxjs';

let loading = false;

export const CurrentUserResolver: ResolveFn<Profile | boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);

  return store.pipe(
    select(selectIsMeLoaded),
    tap((isMeLoaded) => {
      if (!loading && !isMeLoaded) {
        loading = true;
        return store.dispatch(CurrentUserActions.getMe());
      }
    }),
    filter((isMeLoaded) => isMeLoaded),
    first(),
    finalize(() => (loading = false))
  );
};
