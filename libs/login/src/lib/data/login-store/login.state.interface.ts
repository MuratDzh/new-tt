import { BackendErrorsInterface } from './../../../../../interfaces/src/lib/backend-errors/backend.errors.interface';

import { Auth } from '../../../../../tt-auth/src/lib/tt-auth/auth.service';


export interface LoginStateInterface {
  tokens: Auth | null;
  backendErrors: BackendErrorsInterface | null;
}
