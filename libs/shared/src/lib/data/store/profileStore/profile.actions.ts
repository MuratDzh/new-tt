import { createActionGroup, props } from '@ngrx/store';


import { Update } from '@ngrx/entity';

import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { Profile } from '@tt/interfaces/profile';


export const ProfileActions = createActionGroup({
  source: 'Profile Page Resolver',
  events: {
    'Load Profile': props<{ id: string | number }>(),
    'Load Profile Success': props<{ profile: Profile }>(),

    'Load Profile Success After Subscribe Changed': props<{
      profile: Update<Profile>;
    }>(),
    'Load Profile Failure': props<{ errors: BackendErrorsInterface }>(),

    'Load Current Profile': props<{ id: string | number }>(),
    'Load Current Profile Success': props<{ profile: Profile | null }>(),
  },
});
