import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatRes, Message } from '../interfces/chats.interface';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  url = 'https://icherniakov.ru/yt-course/';
  _messages$ = new BehaviorSubject<Message[] | null>(null);
  messages$: Observable<Message[] | null> = this._messages$.asObservable();

  _chats$ = new BehaviorSubject<Chat[] | null>(null);
  chats$: Observable<Chat[] | null> = this._chats$.asObservable();

  constructor(private http: HttpClient) {}

  postChat(userId: number) {
    return this.http
      .post<ChatRes>(`${this.url}chat/${userId}`, {})
      .pipe(tap((v) => this._messages$.next(v.messages)));
  }

  getChatById(chatId: number) {
    return this.http
      .get<ChatRes>(`${this.url}chat/${chatId}`)
      .pipe(tap((v) => this._messages$.next(v.messages)));
  }

  postMessage(chatId: number, text: string, userId: number) {
    return this.http
      .post<Message>(
        `${this.url}message/send/${chatId}`,
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
    return this.http
      .get<Chat[]>(`${this.url}chat/get_my_chats/`)
      .pipe(tap((v) => this._chats$.next(v)));
  }
}
