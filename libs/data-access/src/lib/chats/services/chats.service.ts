import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  tap,
  filter,
} from 'rxjs';
import {
  Chat,
  ChatRes,
  Message,
  
} from '@tt/interfaces/chat';

import { Store } from '@ngrx/store';
import { selectMe, environment } from '@tt/shared';
import { ChatWsNativeService } from './chat-ws-native.service';

import { CookieService } from 'ngx-cookie-service';
import { ChatWSMessageType, ChatWSServiceInterface } from './../interfaces';
import {
  
  
  isNewMessage,
  isUnreadMessage,
} from './../interfaces/type-guard';
import { Profile } from '@tt/interfaces/profile';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { isErrorMessageFunc } from '../interfaces/type-guard';


@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  // url = 'https://icherniakov.ru/yt-course/';
  _messages$ = new BehaviorSubject<Message[] | null>(null);
  messages$: Observable<Message[] | null> = this._messages$.asObservable();

  _chats$ = new BehaviorSubject<Chat[] | null>(null);
  chats$: Observable<Chat[] | null> = this._chats$.asObservable();

  myId!: number | string;
  me!: Profile | null;

  unredMessagesCount = signal<number>(0);

  cookieService = inject(CookieService);
  

  store = inject(Store)
    .select(selectMe).pipe(filter(v=>!!v))
    .subscribe((v) => ((this.myId = v!.id), (this.me = v)));

  wsAdapter: ChatWSServiceInterface = new ChatWsRxjsService();

  constructor(private http: HttpClient) {}

  wsConnect() {
    return this.wsAdapter.connect({
      url: `${environment.url}chat/ws`,
      token: this.cookieService.get('token'),
      handleMessage: this.handleMessage,
    }) as Observable<ChatWSMessageType>;
  }
  // wsConnect() {
  //   this.wsAdapter.connect({
  //     url: `${environment.url}chat/ws`,
  //     token: this.cookieService.get('token'),
  //     handleMessage: this.handleMessage
  //   })
  // }

  wsClose() {
    return this.wsAdapter.disconnect();
  }

  handleMessage = (message: ChatWSMessageType): void => {
    console.log('handleMessage', message);

    if (!('action' in message)) return;

    if (isErrorMessageFunc(message)) {
      console.log('Error: ' + message);

    }

    if (!isNewMessage(message)&&!isUnreadMessage(message)) {
      console.log(
        '!isNewMessage(message)&&!isUnreadMessage(message), Error: ' + message
      );
    }

    if (isUnreadMessage(message)) {
      console.log('isUnreadMessage(message)', message.data.count);

      this.unredMessagesCount.set(message.data.count);
    }

    if (isNewMessage(message)) {
      console.log('isNewMessage(message)');

      this._messages$.next([
        ...(this._messages$.getValue()
          ? (this._messages$.getValue() as Message[])
          : []),

        {
          id: message.data.id as number,
          userFromId: message.data.author as number,
          personalChatId: message.data.chat_id as number,
          text: message.data.message as string,
          createdAt: message.data.created_at as string,
          isRead: false,

          user: message.data.author === this.myId ? this.me : null,
        },
      ]);

    }

   
    this.messages$.subscribe();
    this.chats$.subscribe();
  };

  postChat(userId: number) {
    return this.http
      .post<ChatRes>(`${environment.url}chat/${userId}`, {})
      .pipe(tap((v) => this._messages$.next(v.messages)));
  }

  getChatById(chatId: number) {
    return this.http.get<ChatRes>(`${environment.url}chat/${chatId}`).pipe(
      map((v) => {
        return {
          ...v,

          companion: v.userFirst.id == this.myId ? v.userSecond : v.userFirst,
          messages: v.messages.map((b) => {
            return {
              ...b,

              user:
                v.userFirst.id === b.userFromId ? v.userFirst : v.userSecond,
            };
          }),
        };
      }),
      tap((v) => this._messages$.next(v.messages))
    );
  }

  postMessage(chatId: number, text: string, userId: number) {
    return this.http
      .post<Message>(
        `${environment.url}message/send/${chatId}`,
        {},
        { params: { message: text } }
      )
      .pipe(
        switchMap(() => {
          return this.getChatById(chatId);
        })
      );
  }

  getMyChats() {
    return this.http.get<Chat[]>(`${environment.url}chat/get_my_chats/`).pipe(
      map((v) => {
        return this._chats$.next(v);
      })
    );
  }
}
