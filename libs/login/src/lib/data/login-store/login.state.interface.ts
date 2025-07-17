import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';

import { Auth } from '@tt/tt-auth';


export interface LoginStateInterface {
  tokens: Auth | null;
  backendErrors: BackendErrorsInterface | null;
}
