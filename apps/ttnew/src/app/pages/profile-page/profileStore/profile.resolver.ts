import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { ProfileActions } from './profile.actions';

import { concatMap, first, map, of, switchMap, tap } from 'rxjs';
import { selectMe } from '../../../data/currentUserStore/current-user.reducer';
import {
  selectCurrentUser,
  selectEntities,
  selectIds,
} from './profile.reducer';

export const getProfileResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let currentId = route.params['id'];
  console.log('ID', currentId);

  let currentUserId: string | number | undefined = undefined;

  const store = inject(Store);

  let ids: number[] | string[] = [];
  store.pipe(select(selectIds)).subscribe((v) => (ids = v));
  store
    .pipe(select(selectCurrentUser))
    .subscribe((v) => (currentUserId = v?.id));
  let myId: number | string = '';
  store.select(selectMe).subscribe((v) => (myId = v!.id));

  return store.pipe(
    select(selectIds),
    tap((v) => {
      if (!ids.find((v) => v == currentId)) {
        if (currentId === 'me') {
          if (myId !== null && currentUserId !== myId) {
            if (ids.find((v) => v == myId)) {
              store.dispatch(ProfileActions.loadCurrentProfile({ id: myId }));
              return store.select(select);
            }

            store.dispatch(ProfileActions.loadProfile({ id: myId }));

            return store.select(selectMe);
          } else {
            return store.select(selectMe);
          }
        } else {
          return store.dispatch(ProfileActions.loadProfile({ id: currentId }));
        }
      } else {
        return of(
          store.dispatch(ProfileActions.loadCurrentProfile({ id: currentId }))
        ).pipe(
          concatMap(() => {
            return store.select(selectEntities).pipe(map((v) => v[currentId]));
          })
        );
      }
    }),
    first()
  );
};
