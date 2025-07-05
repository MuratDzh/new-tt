import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Profile } from '../interfces/profile.interface';
import { Subscribers } from '../interfces/subscribers.interfase';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  url = 'https://icherniakov.ru/yt-course/';

  constructor(private http: HttpClient) {}

  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.url}account/test_accounts`);
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${this.url}account/me`);
  }

  getProfile(id: Observable<string | number>): Observable<Profile> {
    // if (id === "me") return this.getMe();
    return this.http.get<Profile>(`${this.url}account/${id}`);
  }

  getProfileResolver(id: string | number): Observable<Profile> {
    if (id === 'me') {
      console.log('МЕНЯ ВЫЗВАЛИ С -ME-');

      return this.getMe();
    } else {
      console.log('МЕНЯ ВЫЗВАЛИ С -ID-', id);
      return this.http.get<Profile>(`${this.url}account/${id}`);
    }
  }

  getSubscribers(): Observable<Subscribers<Profile>> {
    return this.http.get<Subscribers<Profile>>(
      `${this.url}account/subscribers/`
    );
  }

  getSubscribersById(id: number): Observable<Subscribers<Profile>> {
    console.log('РАБОТАЕТ PROFILE SERVICE');
    return this.http.get<Subscribers<Profile>>(
      `${this.url}account/subscribers/${id}`
    );
  }

  getSubscribersShortList(n: number): Observable<Profile[] | null> {
    return this.http
      .get<Subscribers<Profile>>(`${this.url}account/subscribers/`)
      .pipe(map((sub) => (sub.items ? sub.items.slice(0, n) : null)));
  }

  getAccounts(
    value: Record<string, any> = {}
  ): Observable<Subscribers<Profile>> {
    console.log('value', value);
    return this.http.get<Subscribers<Profile>>(`${this.url}account/accounts`, {
      params: value,
    });
  }

  patchMe(formValue: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.url}account/me`, formValue);
  }

  uploadImg(file: File) {
    let img = new FormData();
    img.append('image', file);
    return this.http.post<string>(`${this.url}account/upload_image`, img);
  }

  toSubscribe(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(
      `${this.url}account/subscribe/${profile.id}`,
      {}
    );
    // return this.http.post<Profile>(`${this.url}subscribe/${500}`, {});
  }

  toUnsubscribe(profile: Profile): Observable<Profile> {
    return this.http.delete<Profile>(
      `${this.url}account/subscribe/${profile.id}`,
      {}
    );
    // return this.http.post<Profile>(`${this.url}subscribe/${500}`, {});
  }

  getSubscription(): Observable<Subscribers<Profile>> {
    return this.http.get<Subscribers<Profile>>(
      `${this.url}account/subscriptions/`
    );
  }

  getSubscriptionsById(id: number): Observable<Subscribers<Profile>> {
    return this.http.get<Subscribers<Profile>>(
      `${this.url}account/subscriptions/${id}`
    );
  }
}
