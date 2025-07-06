import { Injectable } from '@angular/core';
import { ChatConnectionWSParams, ChatWSServiceInterface } from './../../../../../interfaces/src';
import { Observable } from 'rxjs';
import { ChatWSMessageType } from '..';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';

@Injectable({
  providedIn: 'root',
})
export class ChatWsRxjsService implements ChatWSServiceInterface {
  #ws!:WebSocketSubject<any>
  constructor() {}

  connect(
    params: ChatConnectionWSParams
  ) : void | Observable<ChatWSMessageType>{};
  sendMessage(message: string, chatId: number) : void{}
  disconnect() : void{}
}
