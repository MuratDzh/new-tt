import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { ProfileActions } from './profile.actions';

import { concatMap, filter, first, map, of, switchMap, tap } from 'rxjs';
import { selectMe } from '../currentUserStore/current-user.reducer';
import {
  selectCurrentUser,
  selectProfileEntities,
  selectProfileIds,
} from './profile.reducer';
import { Profile } from '@tt/interfaces/profile';

export const getProfileResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let currentId = route.params['id'];
  console.log('ID', currentId);

  let currentUserId: string | number | undefined = undefined;

  const store = inject(Store);
  

  let ids: number[] | string[] = [];
  store.pipe(select(selectProfileIds)).subscribe((v) => (ids = v));
  store
    .pipe(select(selectCurrentUser),
      tap((v)=>console.log("ПУСТО?",v)
      ),
      filter(user => !!user),
      tap((v)=>console.log('TAP',v)
      )
    )
    .subscribe((v) => (currentUserId = v?.id));
  let myId: number | string = (JSON.parse(window.localStorage.getItem("me") as string) as Profile).id;
//  let myId:string|number
  
  store.select(selectMe).subscribe((v) => (myId = v!.id));

  return store.pipe(
    select(selectProfileIds),
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
            return store
              .select(selectProfileEntities)
              .pipe(map((v) => v[currentId]));
          })
        );
      }
    }),
    first()
  );
};
