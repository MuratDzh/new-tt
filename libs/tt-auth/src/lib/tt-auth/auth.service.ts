import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@tt/shared';
import { tap } from 'rxjs';

export interface Auth {
  access_token: 'string';
  refresh_token: 'string';
  token_type: 'string';
}

export interface FormLoginValue {
  username: string;
  password: string;
}

let isFirst=false

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string | null = null;
  refresh_token: string | null = null;

  get isAuth() {
    if (!this.token) {
      this.token = this.cookie.get('token');
    }

    return !!this.token;
  }

  constructor(
    private http: HttpClient,

    private router: Router,
    private cookie: CookieService
  ) {}

  login(payload: FormLoginValue) {
    
    const url = environment.url + 'auth/token';
   
    const fd = new FormData();
    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http.post<Auth>(url, fd)
  }


  refreshToken() {
    console.log(this.token);
    const url = environment.url + 'auth/refresh';
  
    console.log(url);
    return this.http
      .post<Auth>(url, { refresh_token: this.cookie.get('refresh_token') })
      .pipe(

        tap((res: Auth) => {
          
          if(!isFirst) {
            isFirst = true;
            this.saveTokens(res);
            isFirst = false;
          }
         
        })
      );
  }

  saveTokens(res: Auth) {

    this.cookie.deleteAll()
    this.cookie.set('token', res.access_token, {path: '/'});
    this.cookie.set('refresh_token', res.refresh_token, {path: '/'});
  }
}
