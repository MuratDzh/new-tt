import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface';
import { Profile } from '../../../../../../profile/src/lib/data/interfaces/profile.interface';
import { Subscribers } from '../../../../../../interfaces/src/lib/subscribers/subscribers.interfase';

export interface AccountsStateInterface {
  isAccountsLoaded: boolean;
  accounts: Subscribers<Profile> | null;
  backandErrors: BackendErrorsInterface | null;
  total:number;
  page: number ;
  size: number ;
  pages:number;
}
