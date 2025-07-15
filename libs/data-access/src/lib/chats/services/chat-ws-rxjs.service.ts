import { inject, Injectable } from '@angular/core';

import { finalize, map, Observable, switchMap, tap, firstValueFrom, catchError } from 'rxjs';
import { ChatConnectionWSParams, ChatWSMessageType, ChatWSServiceInterface, isErrorMessageFunc } from '..';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { AuthService } from '../../../../../tt-auth/src/lib/tt-auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ChatWsRxjsService implements ChatWSServiceInterface {
  #ws!: WebSocketSubject<ChatWSMessageType>;

  authService = inject(AuthService)
  cookieService=inject(CookieService)

  constructor() {}

  connect(
    params: ChatConnectionWSParams
  ): Observable<ChatWSMessageType> {
    if (!this.#ws) {
      this.#ws = new WebSocketSubject({
        url: params.url,
        protocol: [params.token],
      });
    }

    return this.#ws.asObservable().pipe(
      tap((message) => params.handleMessage(message)),
      catchError(err => {
        console.log('catchError(err');
        
        throw new Error(err)
      }),
      finalize(() => {
        console.log('Финиш')
        console.log('finalize(() params', params.token);
        
      })
    );
  }
  sendMessage(message: string, chatId: number): void {
    this.#ws.next({
      text: message,
      chat_id: chatId,
    });
  }
  disconnect(): void {
    console.log('disconnect()');
    
    this.#ws.complete();
  }
}
