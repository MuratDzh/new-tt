import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subscribers } from '@tt/interfaces/subscribers';
import { Profile } from '@tt/interfaces/profile';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';

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
