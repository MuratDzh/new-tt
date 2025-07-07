import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { inject } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { selectIsMeLoaded, selectMe } from './current-user.reducer';
import { CurrentUserActions } from './current-user.actions';
import { filter, finalize, first, tap, switchMap, of, Observable } from 'rxjs';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';
import { ProfileService } from '../../services';

let loading = false;

export const CurrentUserResolver: ResolveFn<Profile | boolean|Observable<Profile|null>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const service = inject(ProfileService)

  // return store.pipe(
  //   select(selectIsMeLoaded),
  //   switchMap((isMeLoaded) => {
      // if (!loading && !isMeLoaded) {
      //   loading = true;
        return service
          .getMe()
          .pipe(tap((me) => {
            window.localStorage.setItem('me', JSON.stringify(me));
            store.dispatch(CurrentUserActions.getMe())
          }));
        // }
        // return

    // }),
    // filter((isMeLoaded) => isMeLoaded),
    // first(),
    // finalize(() => (loading = false))
  // );

  // return service
  //   .getMe()
  //   .pipe(tap(() => store.dispatch(CurrentUserActions.getMe())));

};
