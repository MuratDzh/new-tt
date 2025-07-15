import { SlicePipe } from '@tt/profile';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Profile } from '@tt/interfaces/profile';
import { debounceTime, filter, firstValueFrom, map, Observable, Subscription, tap, timer, catchError } from 'rxjs';
import { ImgPipe, SubscriberCardComponent, SvgDirective } from '@tt/common-ui';
import {  Store } from '@ngrx/store';
import { selectMe, selectSubscriptionsState } from '@tt/shared';
import { ChatsService, isErrorMessageFunc, isNewMessage, isUnreadMessage } from '@tt/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../tt-auth/src/lib/tt-auth/auth.service';
import { ProfileService } from '../../../../../shared/src/lib/data/services/profile-service/profile.service';




@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgDirective,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SubscriberCardComponent,
    ImgPipe,
    SlicePipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  me: Profile | null = null;

  meSubscription?: Subscription;
  menuItems = [
    {
      lebel: 'Моя страница',
      icon: 'home',
      link: '/profile/me',
    },
    {
      lebel: 'Чаты',
      icon: 'chat',
      link: '/chats',
    },
    {
      lebel: 'Поиск',
      icon: 'search',
      link: '/search',
    },
  ];

  subscribers$!: Observable<Profile[] | null>;
  subscriptions$!: Observable<Profile[] | null>;
  subscriptionsTotal$!: Observable<number>;

  amount = 6;

  el = inject(ElementRef);
  renderer = inject(Renderer2);
  cdr = inject(ChangeDetectorRef);
  chatService = inject(ChatsService);
  destroyRef = inject(DestroyRef);
  authService = inject(AuthService)
  profileService=inject(ProfileService)

  unreadMessagesCount = this.chatService.unredMessagesCount;
  wsConnection!: Subscription

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.subscriptions$ = this.store
      .select(selectSubscriptionsState)
      .pipe(map((v) => v.items));

    this.subscriptionsTotal$ = this.store
      .select(selectSubscriptionsState)
      .pipe(map((v) => v.total));

    this.meSubscription = this.store
      .select(selectMe)
      .subscribe((v) => (this.me = v));

    this.connect()
   
    // setTimeout(() => {
    //   console.log('disconnect, this', this);
    //   this.wsConnection?.unsubscribe();
    //   this.chatService.wsAdapter.disconnect();
    // }, 60000)
    
  
    // setTimeout(() => {
    //   console.log('connect');
      
    //       this.connect()
        
    // }, 300000)

    // setTimeout(() => {
    //   console.log('connect 40');
    //   this.connect()
    // }, 400000)

    // setTimeout(() => {
    //   console.log('connect 50');
    //   this.connect()
    // }, 500000)
  }

  connect() {
   return this.wsConnection= this.chatService
      .wsConnect()
     .pipe(
       
       takeUntilDestroyed(this.destroyRef))
      .subscribe((mes) => {
        console.log('message', mes);

        if (isErrorMessageFunc(mes)) {
          console.log('isErrorMessageFunc(mes)');

          this.reconnect();
        }
        else if (!isUnreadMessage(mes) && !isNewMessage(mes)) {
          console.log('!isUnreadMessage(mes) && !isNewMessage(mes)');

          this.reconnect();
        }
      },
        err => console.log('ERRR',err),
      ()=>console.log("COMPLETE")
      );
  }

  async reconnect() {
    console.log('reconnect()');
    
    this.wsConnection?.unsubscribe()
    this.chatService.wsAdapter.disconnect()
    await (firstValueFrom(this.profileService.getMe()))
    console.log('После рефреш');
    
    await firstValueFrom(timer(2000))
    console.log('После таймера');
    this.connect()
};
  

  ngAfterViewInit(): void {
    const { top } = this.el.nativeElement.children[3].getBoundingClientRect();

    const height =
      document.documentElement.clientHeight - 40 - 16 - 40 - top - 16;
    this.renderer.setStyle(
      this.el.nativeElement.children[3],
      'max-height',
      `${height}px`
    );
  }

  viewAllSub() {
    this.amount == 6 ? (this.amount = 100) : (this.amount = 6);
  }

  ngOnDestroy(): void {
    this.meSubscription?.unsubscribe();
  }
}
