import { BackendErrorsInterface } from '../../../../data/interfces/backend.errors.interface';
import { Profile } from '../../../../data/interfces/profile.interface';
import { Subscribers } from '../../../../data/interfces/subscribers.interfase';
import { SearchForm } from '../profile-filter.component';

export interface FilterAccountsInterface {
  isAccountsLoaded: boolean;
  accounts: Subscribers<Profile> | null;
  backandErrors: BackendErrorsInterface | null;
  searchFormValue: Partial<SearchForm> | null;
}
