import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const CanActivateAuth = () => {
  const isAuth = inject(AuthService).isAuth;
  const router = inject(Router);
  if (isAuth) return true;
  return router.navigateByUrl('login');
};
