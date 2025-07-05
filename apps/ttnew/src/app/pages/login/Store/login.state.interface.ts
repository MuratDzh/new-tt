import { Auth } from '../../../auth/auth.service';
import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';

export interface LoginStateInterface {
  tokens: Auth | null;
  backendErrors: BackendErrorsInterface | null;
}
