import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { Profile } from '@tt/interfaces/profile';
import { Subscribers } from '@tt/interfaces/subscribers';
import { SearchForm } from '@tt/interfaces/search-form';


export interface FilterAccountsInterface {
  isAccountsLoaded: boolean;
  accounts: Subscribers<Profile> | null;
  backandErrors: BackendErrorsInterface | null;
  searchFormValue: Partial<SearchForm> | null;
  page: number;
  size: number;
}
