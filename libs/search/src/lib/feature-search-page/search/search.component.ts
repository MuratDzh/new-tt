import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import {debounceTime, map, Observable, tap} from 'rxjs';
import { Profile } from '@tt/interfaces/profile';
import { ProfileFilterComponent } from '../profile-filter/profile-filter.component';
import { Store } from '@ngrx/store';
import {
  selectAccounts,
  selectIsAccountsLoaded,
  selectFilteredAccounts,
  selectIsFilteredAccountsLoaded,
  SubscriptionsActions, FilterAccountsActions, AccountsActions,
} from '@tt/shared';

import { ProfileCardComponent } from '@tt/profile';

import {

  UpdateStorsAfterSubscrube,
} from '../../../../../shared/src/lib/data/store/subscriptionsStore/subscriptions.actions';
import {InfiniteScrollTriggerComponent, WrapperComponent} from "@tt/common-ui";
import {ChatsService} from "@tt/chat";
import {Chat, ChatRes} from "@tt/interfaces/chat";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ProfileCardComponent, CommonModule, ProfileFilterComponent,
    InfiniteScrollTriggerComponent, WrapperComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  acc$!: Observable<Profile[] | null>;

  isAccLoaded$!: Observable<boolean>;
  chatsService=inject(ChatsService)
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.acc$ = this.store
      .select(selectAccounts)
      .pipe(map((v) => {
        console.log('СМОТРИМ как МЕНЯЕТСЯ Список', v);
        
        return v ? v.items : null
      }))

    let IsFilteredAccountsLoaded = false;
    this.store
      .select(selectIsFilteredAccountsLoaded)
      .subscribe((v) => (IsFilteredAccountsLoaded = v));

    if (IsFilteredAccountsLoaded) {
      this.acc$ = this.store
        .select(selectFilteredAccounts)
        .pipe(map((v) => (v ? v.items : null)));
    }

    this.isAccLoaded$ = this.store.select(selectIsAccountsLoaded);
  }

  onSubscribe(profile: Profile) {
    // profile.isSubscribed=true
    this.store.dispatch(SubscriptionsActions.subscribe({ profile })) ;
    this.store.dispatch(
      UpdateStorsAfterSubscrube.updateStorsAfterSubscribe({ profile })
    );
    this.acc$ = this.store.select(selectAccounts).pipe(
      // debounceTime(0),
      map((v) => {
        console.log('СМОТРИМ как МЕНЯЕТСЯ Список', v);

        return v ? v.items : null;
      })
    );
  }

  onUnsubscribe(profile: Profile) {
    // profile.isSubscribed=false
    this.store.dispatch(SubscriptionsActions.unsubscribe({ profile })),
      this.store.dispatch(
        UpdateStorsAfterSubscrube.updateStorsAfterUnsubscribe({ profile })
      );
    this.acc$ = this.store.select(selectAccounts).pipe(
        // debounceTime(0),
        map((v) => {
          console.log('СМОТРИМ как МЕНЯЕТСЯ Список', v);

          return v ? v.items : null;
        })
      );
  }

  onSendMessage(profile: Profile) {
    console.log("SendMessage", profile.id);
    this.chatsService.postChat(profile.id).pipe(
      tap((chat: ChatRes) => this.router.navigate([`/chats/${chat.id}`]))
    ).subscribe()

    ;
  }

  onSetFilteredAccounts(){
    console.log("Тригер загрузки Сортированных аккаунтов")
    this.store.dispatch(FilterAccountsActions.setPage({}))
  }
  onSetAllAccounts(){
    console.log("Тригер загрузки всех аккаунтов")
    this.store.dispatch(AccountsActions.setPage({}))
  }
}
