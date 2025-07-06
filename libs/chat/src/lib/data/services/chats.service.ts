import { environment } from './../../../../../shared/src/lib/data/environments/environment';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {BehaviorSubject, filter, map, Observable, switchMap, tap} from 'rxjs';
import { Chat, ChatRes, Message } from '../../../../../interfaces/src/lib/chat/chats.interface';


import { Store } from '@ngrx/store';
import { selectMe } from 'libs/shared/src/lib/data/store/currentUserStore/current-user.reducer';
import { ChatWsNativeService } from './chat-ws-native.service';
import { ChatWSServiceInterface } from '@tt/interfaces/chat';
import { CookieService } from 'ngx-cookie-service';
import {ChatWSMessageType, isErrorMessage, isNewMessage, isUnreadMessage} from '../interfaces';
import {Profile} from "@tt/interfaces/profile";
import {ChatWsRxjsService} from "./chat-ws-rxjs.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: 'root',
})
export class ChatsService  {
  // url = 'https://icherniakov.ru/yt-course/';
  _messages$ = new BehaviorSubject<Message[] | null>(null);
  messages$: Observable<Message[] | null> = this._messages$.asObservable();

  _chats$ = new BehaviorSubject<Chat[] | null>(null);
  chats$: Observable<Chat[] | null> = this._chats$.asObservable();

  cookieService=inject(CookieService)

  myId!: number;
  me!:Profile|null

    store = inject(Store)
      .select(selectMe)
      .subscribe((v) => (this.myId = v!.id, this.me=v));


  wsAdapter: ChatWSServiceInterface = new ChatWsRxjsService()


  constructor(private http: HttpClient) {}

  wsConnect() {
    return this.wsAdapter.connect({
      url: `${environment.url}chat/ws`,
      token: this.cookieService.get('token'),
      handleMessage: this.handleMessage
    }) as Observable<ChatWSMessageType>;
  }
  // wsConnect() {
  //   this.wsAdapter.connect({
  //     url: `${environment.url}chat/ws`,
  //     token: this.cookieService.get('token'),
  //     handleMessage: this.handleMessage
  //   })
  // }



   handleMessage =  (message: ChatWSMessageType): void => {
    if (!("action" in message)) return

     if(isErrorMessage(message)){
       console.log("Error: " + message)
     }

    if (isNewMessage(message)) {

      this._messages$.next(
        [

          ...this._messages$.getValue() ?this._messages$.getValue() as Message[]: [],

          {
            id: message.data.id as number,
            userFromId: message.data.author as number,
            personalChatId: message.data.chat_id as number,
            text: message.data.message as string,
            createdAt: message.data.created_at as string,
            isRead:false,

            user: message.data.author === this.myId? this.me:null
          }
        ]
      )


          console.log("Я тут")
          // this._chats$.next(
          //   [
          //     ...this._chats$.getValue()!.map(v=>v.id==message.data.chat_id?
          //         {
          //       ...v,
          //       unreadMessages:v.unreadMessages + 1
          //     }
          //     :v
          //     ) as Chat[]
          //
          //   ]
          // )

      // this.getMyChats().subscribe()

      console.log("MESSAGE",message)
    }

    console.log('_chats$', this._chats$.getValue())
    this.messages$.subscribe(v=>console.log("MESSAGE",v));
    this.chats$.subscribe(v=>console.log("Chats", v));

  }

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
    console.log('getMyChats');
    return this.http
      .get<Chat[]>(`${environment.url}chat/get_my_chats/`)
      .pipe(map((v) =>{
        console.log("Чаты", v)

          return this._chats$.next(v)}));
  }
}
