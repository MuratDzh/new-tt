import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subscribers } from '../../../../../../interfaces/src/lib/subscribers/subscribers.interfase';

import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';

export const SubscriptionsActions = createActionGroup({
  source: 'Resolver APP INIT',
  events: {
    'Load My Subscriptions': emptyProps(),
    'Load My Subscriptions Success': props<{
      profiles: Subscribers<Profile>;
    }>(),
    'Load My Subscriptions Failure': props<{
      errors: BackendErrorsInterface;
    }>(),

    Subscribe: props<{ profile: Profile }>(),

    'Subscribe Success': props<{ profile: Profile }>(),
    'Subscribe Failure': props<{ errors: BackendErrorsInterface }>(),

    Unsubscribe: props<{ profile: Profile }>(),
    'Unsubscribe Success': props<{ profile: Profile }>(),
    'Unsubscribe Failure': props<{ errors: BackendErrorsInterface }>(),
  },
});

export const UpdateStorsAfterSubscrube = createActionGroup({
  source: 'Search Page',
  events: {
    'Update Stors After Subscribe': props<{ profile: Profile }>(),
    'Update Stors After Unsubscribe': props<{ profile: Profile }>(),
    'Update Stors Success': emptyProps(),
  },
});
