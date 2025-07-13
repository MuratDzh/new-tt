import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from 'rxjs';
import {ChatsService} from "@tt/chat";

let isRefreshing$ = new BehaviorSubject(false);

export const AuthTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  
  const authService = inject(AuthService);
  const chatService=inject(ChatsService)
  const cookie = inject(CookieService);
  const token = cookie.get('token');

  if(req.url.includes('dadata')) return next(req)
  if (!token) return next(req);
  req = Req(req, token);
  if (isRefreshing$.value) {
    console.log('2', req);
    return next(req);
  }


  return next(req).pipe(
    // tap(()=>console.log('2', req)),
    catchError((err: HttpErrorResponse) => {
      // console.log('3', req);
      if (err.status === 403) {
        // console.log('4', req);

        if (!isRefreshing$.value) {
          isRefreshing$.next(true);
          return authService.refreshToken().pipe(
            switchMap((v) => {
              req = Req(req, v.access_token);
              console.log('1', req);

              return next(req).pipe(
                tap(()=>isRefreshing$.next(false))
              );
            })
          );
        }

        if(req.url.includes('refresh')) next(Req(req, cookie.get('token')));

        return isRefreshing$.pipe(
          filter((isRefreshing) => !isRefreshing),
          switchMap(() =>{
            req= Req(req, cookie.get('token'));
            return next(req)})
        );
      }

      return throwError(err);
    })
  );

  function Req(req: HttpRequest<unknown>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
};
