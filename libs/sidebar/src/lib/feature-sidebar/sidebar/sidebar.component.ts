import { SlicePipe } from '@tt/profile';
import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject, Input, input, OnChanges,
  OnDestroy,
  OnInit,
  Renderer2, SimpleChanges,
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Profile } from '@tt/interfaces/profile';
import { filter, map, Observable, Subscription } from 'rxjs';
import { ImgPipe, SubscriberCardComponent, SvgDirective } from '@tt/common-ui';
import {  Store } from '@ngrx/store';
import { selectMe, selectSubscriptionsState } from '@tt/shared';
import { ChatsService } from '@tt/chat';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';




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
export class SidebarComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
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
  destroyRef=inject(DestroyRef)

  unreadMessagesCount=this.chatService.unredMessagesCount

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Changes',changes['unreadMessagesCount'].currentValue);
    // if(changes['unreadMessagesCount'].currentValue!=changes['unreadMessagesCount'].previousValue){
    //
    //     this.unreadMessagesCount=changes['unreadMessagesCount'].currentValue;
    //     console.log("Проверка СетТаймаута, каунт",this.unreadMessagesCount);
    //     this.cdr.detectChanges()
    //
    // }
  }

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
    
    this.chatService
      .wsConnect()
      .pipe(
        filter((v) => !!v),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

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
