import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subscribers } from '../../../../data/interfces/subscribers.interfase';
import { Profile } from '../../../../data/interfces/profile.interface';
import { BackendErrorsInterface } from '../../../../data/interfces/backend.errors.interface';
import { SearchForm } from '../profile-filter.component';

export const FilterAccountsActions = createActionGroup({
  source: 'Filter Search Page',
  events: {
    // FilterAccounts: props<{serchFormValue:Partial<SearchForm>}>(),
    'Filter Accounts': props<{ searchFormValue: Record<string, any> }>(),
    // "LoadAllAccounts": props<{searchFormValue: Record<string, any>}>(),
    'Filter Accounts Success': props<{ accounts: Subscribers<Profile> }>(),
    'Filter Accounts Failure': props<{ errors: BackendErrorsInterface }>(),
  },
});
