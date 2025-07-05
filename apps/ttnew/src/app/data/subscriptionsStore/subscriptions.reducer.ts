import { Subscribers } from '../interfces/subscribers.interfase';
import { Profile } from '../interfces/profile.interface';

import { createFeature, createReducer, on } from '@ngrx/store';
import { SubscriptionsActions } from './subscriptions.actions';

export const SubscriptionsInitialState: Subscribers<Profile> = {
  total: 0,
  page: 0,
  size: 0,
  pages: 0,
  items: null,
};

const SubscriptionsFeatureReducer = createFeature({
  name: 'Subscriptions',
  reducer: createReducer(
    SubscriptionsInitialState,
    on(
      SubscriptionsActions.loadMySubscriptionsSuccess,
      (state, { profiles }) => {
        return {
          ...state,
          total: profiles.total,
          page: profiles.page,
          size: profiles.size,
          pages: profiles.pages,
          items: profiles.items,
        };
      }
    ),
    on(SubscriptionsActions.subscribeSuccess, (state, action) => {
      return {
        ...state,
        total: state.total + 1,
        items: [...state.items!, action.profile],
      };
    }),
    on(SubscriptionsActions.unsubscribeSuccess, (state, action) => {
      return {
        ...state,
        total: state.total - 1,
        items: [
          ...(state.items as Profile[])?.filter((v) =>
            v.id ? v.id !== action.profile.id : v
          ),
        ],
      };
    })
  ),
});

export const {
  name: SubscriptionsFeatureReducerKey,
  reducer: SubscriptionsReducer,
  selectSubscriptionsState,
} = SubscriptionsFeatureReducer;
