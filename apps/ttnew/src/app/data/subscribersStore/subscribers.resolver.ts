import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, finalize, first, tap } from 'rxjs';
import { getSubscribersActions } from './subscribers.actions';
import { Subscribers } from '../interfces/subscribers.interfase';
import { Profile } from '../interfces/profile.interface';
import { selectSubscribers } from './subscribers.reducer';
import { SubEntities } from './subscribers.interface';
import { ProfileService } from '../services/profile.service';

let isLoaded = false;

export const getSubscribersResolver: ResolveFn<any> = (
  // export const getSubscribersResolver: ResolveFn<SubEntities|boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);

  // return store.pipe(
  //   select(selectSubscribers),
  //   tap((isSubscribersLoaded) => {
  //     if (!isLoaded && !isSubscribersLoaded) {
  //       isLoaded = true;
  //       // if(())
  //       console.log("RESOLVER ID,", route.params['id'])
  //       store.dispatch(getSubscribersActions.getSubscribers({id: route.params['id']}));
  //     }
  //     return store.pipe(select(selectSubscribers));
  //   }),
  //
  //   // filter((isSubscribersLoaded) => isSubscribersLoaded),
  //
  //   first(),
  //   finalize(() => (isLoaded = false))
  // );
  console.log('RESOLVER ID,', route.params['id']);

  return store.dispatch(
    getSubscribersActions.getSubscribers({ id: route.params['id'] })
  );
};
