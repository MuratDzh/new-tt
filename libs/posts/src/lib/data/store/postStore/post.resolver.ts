import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';

import { first, map, tap } from 'rxjs';
import { PostActions } from './post.actions';

import { selectMe } from '@tt/shared';
import { selectPostsIds } from './post.reducer';
import { selectCurrentPostEntities } from '../myPostStore/currentUserPosts.reducer';
import { PostRes } from '../../interfaces/post.interface';

export const getPostResolver: ResolveFn<
  PostRes[] | string[] | number[] | boolean
> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  let currentId = route.params['id'];
  let ids: number[] | string[] = [];
  store.pipe(select(selectPostsIds)).subscribe((v) => (ids = v));
  let myId: string | number = '';
  store.select(selectMe).subscribe((v) => (myId = v!.id));

  return store.pipe(
    select(selectPostsIds),
    tap((v) => {
      console.log('RESOLVER', v);

      if (!ids.find((v) => v == currentId)) {
        if (currentId === 'me') {
          console.log('IF ME');

          if (!ids.find((v) => v == myId)) {
            console.log('IF ME NOT');

            return store.dispatch(PostActions.postLoad({ id: myId }));
          } else {
            console.log('IF ME YES');
            return store
              .select(selectCurrentPostEntities)
              .pipe(map((v) => v[myId]));
          }
        } else {
          console.log('ELSE NOT ME');

          store.dispatch(PostActions.postLoad({ id: currentId }));
          console.log('ELSE []');
          return store
            .select(selectCurrentPostEntities)
            .pipe(
              tap((v) => console.log('!!!', v)),

              map((v) => {
                return v[currentId];
              })
            )
            .subscribe();
        }
      } else {
        console.log('ELSE SELECT');

        return store
          .select(selectCurrentPostEntities)
          .pipe(map((v) => v[currentId]))
          .subscribe();
      }
    }),
    first()
  );
};
