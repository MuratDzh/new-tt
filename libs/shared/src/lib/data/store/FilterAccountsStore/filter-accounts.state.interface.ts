import { BackendErrorsInterface } from 'libs/interfaces/src/lib/backend-errors/backend.errors.interface';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';
import { Subscribers } from 'libs/interfaces/src/lib/subscribers/subscribers.interfase';
import { SearchForm } from '../../../../../../interfaces/src/lib/search-form/search-form.interface';


export interface FilterAccountsInterface {
  isAccountsLoaded: boolean;
  accounts: Subscribers<Profile> | null;
  backandErrors: BackendErrorsInterface | null;
  searchFormValue: Partial<SearchForm> | null;
  page: number;
  size: number;
}
