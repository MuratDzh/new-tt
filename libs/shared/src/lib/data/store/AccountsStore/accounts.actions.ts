import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subscribers } from '../../../../../../interfaces/src/lib/subscribers/subscribers.interfase';
import { Profile } from '../../../../../../profile/src/lib/data/interfaces/profile.interface';
import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface';

export const AccountsActions = createActionGroup({
  source: 'Search Page Resolver',
  events: {
    LoadAllAccounts: emptyProps(),
    // "LoadAllAccounts": props<{serchFormValue: Record<string, any>}>(),
    'LoadAllAccounts Success': props<{
      accounts: Subscribers<Profile> | null;
    }>(),
    'Set Page': props<{page?:number}>(),
    'LoadAllAccounts Fealure': props<{ errors: BackendErrorsInterface }>(),
  },
});
