import { ChangeDetectionStrategy, Component, inject, OnInit, DestroyRef, viewChildren, ViewChildren, AfterViewChecked, ElementRef, QueryList } from '@angular/core';

import { CommonModule } from '@angular/common';
import { map, Observable, tap } from 'rxjs';
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
} from '@tt/shared';
import {InfiniteScrollTriggerComponent, WrapperComponent} from "@tt/common-ui";
import {ChatsService} from "@tt/data-access";
import { ChatRes } from "@tt/interfaces/chat";
import {Router} from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ProfileCardComponent,
    CommonModule,
    ProfileFilterComponent,
    InfiniteScrollTriggerComponent,
    WrapperComponent,
    InfiniteScrollDirective,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, AfterViewChecked {
  acc$!: Observable<Profile[] | null>;

  isAccLoaded$!: Observable<boolean>;
  chatsService = inject(ChatsService);

  @ViewChildren(ProfileCardComponent, { read: ElementRef })
  profiles!: QueryList<ElementRef>;

  // profiles=viewChildren(ProfileCardComponent, {read: ElementRef<HTMLElement>})

  destroyRef = inject(DestroyRef);

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.acc$ = this.store.select(selectAccounts).pipe(
      map((v) => {
        return v ? v.items : null;
      })
    );

    let IsFilteredAccountsLoaded = false;
    this.store
      .select(selectIsFilteredAccountsLoaded)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => (IsFilteredAccountsLoaded = v));

    if (IsFilteredAccountsLoaded) {
      this.acc$ = this.store
        .select(selectFilteredAccounts)
        .pipe(map((v) => (v ? v.items : null)));
    }

    this.isAccLoaded$ = this.store.select(selectIsAccountsLoaded);
  }

  ngAfterViewChecked(): void {
    console.log('PROFILES', this.profiles.last);
    // if (this.profiles.last) {
    //   this.observer.observe(this.profiles.last.nativeElement);
    // }
  }

  onSubscribe(profile: Profile) {
    // profile.isSubscribed=true
    this.store.dispatch(SubscriptionsActions.subscribe({ profile }));
    this.store.dispatch(
      UpdateStorsAfterSubscrube.updateStorsAfterSubscribe({ profile })
    );
    this.acc$ = this.store.select(selectAccounts).pipe(
      // debounceTime(0),
      map((v) => {
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
        return v ? v.items : null;
      })
    );
  }

  onSendMessage(profile: Profile) {
    this.chatsService
      .postChat(profile.id)
      .pipe(
        tap((chat: ChatRes) => this.router.navigate([`/chats/${chat.id}`])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onSetFilteredAccounts() {
    console.log('Тригер загрузки Сортированных аккаунтов');
    this.store.dispatch(FilterAccountsActions.setPage({}));
  }
  onSetAllAccounts() {
    console.log('Тригер загрузки всех аккаунтов');
    this.store.dispatch(AccountsActions.setPage({}));
  }

  // callback = (entries:any, observer:any) => {
  //   entries.forEach((entry:any) => {
  //     if (entry.isIntersecting) {
  //       console.log('Пользователь почти докрутил до картинки!')
  //       this.onSetAllAccounts()
  //     }
  //   })
  // }

  // options = {

  //   rootMargin: '0px 0px 75px 0px',
  //   threshold: 0,
  // }

  // observer = new IntersectionObserver(this.callback, this.options)

  onScroll() {
    console.log('onScroll()');
    
    this.onSetAllAccounts()
  }
}
