import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';
import { Profile } from '../../../data/interfces/profile.interface';
import { Subscribers } from '../../../data/interfces/subscribers.interfase';

export interface AccountsStateInterface {
  isAccountsLoaded: boolean;
  accounts: Subscribers<Profile> | null;
  backandErrors: BackendErrorsInterface | null;
}
