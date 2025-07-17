import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { Profile } from '@tt/interfaces/profile';
import { Subscribers } from '@tt/interfaces/subscribers';

export interface AccountsStateInterface {
  isAccountsLoaded: boolean;
  accounts: Subscribers<Profile> | null;
  backandErrors: BackendErrorsInterface | null;
  total:number;
  page: number ;
  size: number ;
  pages:number;
}
