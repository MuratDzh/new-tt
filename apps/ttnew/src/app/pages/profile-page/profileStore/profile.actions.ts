import { createActionGroup, props } from '@ngrx/store';
import { Profile } from '../../../data/interfces/profile.interface';
import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';
import { ProfileStateInterface } from './profileState.interface';
import { Update } from '@ngrx/entity';

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
