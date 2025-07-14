import { createActionGroup, props } from '@ngrx/store';

import {
  Auth,
  FormLoginValue,
} from '@tt/tt-auth';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';

export const loginActions = createActionGroup({
  source: 'Login',
  events: {
    Login: props<{ request: FormLoginValue }>(),
    'Login success': props<{ response: Auth }>(),
    'Login failure': props<{ errors: BackendErrorsInterface }>(),
  },
});
