import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from 'libs/interfaces/src/lib/backend-errors/backend.errors.interface';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';
import { Subscribers } from 'libs/interfaces/src/lib/subscribers/subscribers.interfase';


export const FilterAccountsActions = createActionGroup({
  source: 'Filter Search Page',
  events: {
    'Filter Accounts': props<{ searchFormValue: Record<string, any> }>(),
    'Set Page':props<{page?:number}>(),
    'Filter Accounts Success': props<{ accounts: Subscribers<Profile> }>(),
    'Filter Accounts Failure': props<{ errors: BackendErrorsInterface }>(),
  },
});

