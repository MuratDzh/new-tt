import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';


import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionsActions } from './subscriptions.actions';
import { of } from 'rxjs';

export const SubscriptionsResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  return store.dispatch(SubscriptionsActions.loadMySubscriptions());
};
