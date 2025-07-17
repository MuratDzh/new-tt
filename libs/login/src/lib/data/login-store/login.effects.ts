import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { loginActions } from './login.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@tt/tt-auth';

export const loginEffects = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(loginActions.login),
      switchMap(({ request }) => {
        return authService.login(request).pipe(
          tap((res) => {
            authService.saveTokens(res), router.navigateByUrl('');
          }),
          map((response) => {
            return loginActions.loginSuccess({ response });
          }),
          catchError((err: HttpErrorResponse) => {
            return of(loginActions.loginFailure({ errors: err.error }));
          })
        );
      })
    );
  },
  { functional: true }
);
