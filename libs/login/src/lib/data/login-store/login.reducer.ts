import { createFeature, createReducer, on } from '@ngrx/store';
import { LoginStateInterface } from './login.state.interface';
import { loginActions } from './login.actions';
import { routerNavigationAction } from '@ngrx/router-store';

const LoginInitialState: LoginStateInterface = {
  tokens: null,
  backendErrors: null,
};

const loginFeature = createFeature({
  name: 'login',
  reducer: createReducer(
    LoginInitialState,
    on(loginActions.login, (state) => ({
      ...state,
    })),
    on(loginActions.loginSuccess, (state, action) => ({
      ...state,
      tokens: action.response,
    })),
    on(loginActions.loginFailure, (state, action) => ({
      ...state,
      backendErrors: action.errors,
    })),
    on(routerNavigationAction, (state) => ({
      ...state,
      backendErrors: null,
    }))
  ),
});

export const {
  name: loginFeatureKey,
  reducer: loginReducer,
  selectBackendErrors: selectLoginBackendErrors,
} = loginFeature;
