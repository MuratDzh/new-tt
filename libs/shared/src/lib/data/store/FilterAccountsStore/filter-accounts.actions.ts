import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { Profile } from '@tt/interfaces/profile';
import { Subscribers } from '@tt/interfaces/subscribers';


export const FilterAccountsActions = createActionGroup({
  source: 'Filter Search Page',
  events: {
    'Filter Accounts': props<{ searchFormValue: Record<string, any> }>(),
    'Set Page':props<{page?:number}>(),
    'Filter Accounts Success': props<{ accounts: Subscribers<Profile> }>(),
    'Filter Accounts Failure': props<{ errors: BackendErrorsInterface }>(),
  },
});

