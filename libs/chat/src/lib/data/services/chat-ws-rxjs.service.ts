import { Injectable } from '@angular/core';
import {
  ChatConnectionWSParams,
  ChatWSServiceInterface,
} from './../../../../../interfaces/src';
import { finalize, Observable, tap } from 'rxjs';
import { ChatWSMessageType } from '..';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';

@Injectable({
  providedIn: 'root',
})
export class ChatWsRxjsService implements ChatWSServiceInterface {
  #ws!: WebSocketSubject<ChatWSMessageType>;
  constructor() {}

  connect(
    params: ChatConnectionWSParams
  ): void | Observable<ChatWSMessageType> {
    if (!this.#ws) {
      this.#ws = new WebSocketSubject({
        url: params.url,
        protocol: [params.token],
      });
    }

    return this.#ws.asObservable().pipe(
      tap((message) => params.handleMessage(message)),
      finalize(() => console.log('Финиш'))
    );
  }
  sendMessage(message: string, chatId: number): void {
    this.#ws.next({
      text: message,
      chat_id: chatId,
    });
  }
  disconnect(): void {
    this.#ws.complete();
  }
}
