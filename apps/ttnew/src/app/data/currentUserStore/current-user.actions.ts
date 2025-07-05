import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../interfces/profile.interface';

export const CurrentUserActions = createActionGroup({
  source: 'Resolver',
  events: {
    'get Me': emptyProps(),
    'get Me Success': props<{ me: Profile }>(),
    'get Me Failure': emptyProps(),
  },
});
