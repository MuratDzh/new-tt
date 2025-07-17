import { inject } from '@angular/core';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { getSubscribersActions } from './subscribers.actions';


// let isLoaded = false;

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
  

  return store.dispatch(
    getSubscribersActions.getSubscribers({ id: route.params['id'] })
  );
};
