import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subscribers } from '../../../data/interfces/subscribers.interfase';
import { Profile } from '../../../data/interfces/profile.interface';
import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';

export const AccountsActions = createActionGroup({
  source: 'Search Page Resolver',
  events: {
    LoadAllAccounts: emptyProps(),
    // "LoadAllAccounts": props<{serchFormValue: Record<string, any>}>(),
    'LoadAllAccounts Success': props<{
      accounts: Subscribers<Profile> | null;
    }>(),
    'LoadAllAccounts Fealure': props<{ errors: BackendErrorsInterface }>(),
  },
});
