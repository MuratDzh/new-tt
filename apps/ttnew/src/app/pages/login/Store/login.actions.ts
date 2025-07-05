import { createActionGroup, props } from '@ngrx/store';
import { Auth, FormLoginValue } from '../../../auth/auth.service';
import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';

export const loginActions = createActionGroup({
  source: 'Login',
  events: {
    Login: props<{ request: FormLoginValue }>(),
    'Login success': props<{ response: Auth }>(),
    'Login failure': props<{ errors: BackendErrorsInterface }>(),
  },
});
