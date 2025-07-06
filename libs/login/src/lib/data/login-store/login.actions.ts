import { createActionGroup, props } from '@ngrx/store';

import {
  Auth,
  FormLoginValue,
} from '../../../../../tt-auth/src/lib/tt-auth/auth.service';
import { BackendErrorsInterface } from 'libs/interfaces/src/lib/backend-errors/backend.errors.interface';

export const loginActions = createActionGroup({
  source: 'Login',
  events: {
    Login: props<{ request: FormLoginValue }>(),
    'Login success': props<{ response: Auth }>(),
    'Login failure': props<{ errors: BackendErrorsInterface }>(),
  },
});
