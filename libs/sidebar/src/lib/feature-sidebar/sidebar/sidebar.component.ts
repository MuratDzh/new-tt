import { SlicePipe } from './../../../../../profile/src/lib/data/pipes/slice.pipe';
import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  inject, Input, input, OnChanges,
  OnDestroy,
  OnInit,
  Renderer2, SimpleChanges,
} from '@angular/core';
import { SvgDirective } from '../../../../../../libs/common-ui/src/lib/directives/svg.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Profile } from '../../../../../../libs/profile/src/lib/data/interfaces/profile.interface';
import { map, Observable, Subscription } from 'rxjs';
import { ImgPipe } from '../../../../../../libs/common-ui/src/lib/pipes/img.pipe';
import {  Store } from '@ngrx/store';
import { selectMe } from '../../../../../../libs/shared/src/lib/data/store/currentUserStore/current-user.reducer';

import { SubscriberCardComponent } from '../../../../../common-ui/src/lib/components/subscriber-card/subscriber-card.component';
import { selectSubscriptionsState } from '@tt/shared';



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
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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

  amount=6

  el = inject(ElementRef);
  renderer = inject(Renderer2);
  cdr=inject(ChangeDetectorRef)

 //  _unreadMessagesCount=0
 //
 //  get unreadMessagesCount() {
 //    return this._unreadMessagesCount;
 //  }
 //  @Input()
 // set unreadMessagesCount(v:number){
 //    this._unreadMessagesCount=v
 //    // this.cdr.detectChanges()
 //  }
  @Input()
  unreadMessagesCount!: number;




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
    this.amount==6? this.amount=100 : this.amount=6
  }

  ngOnDestroy(): void {
    this.meSubscription?.unsubscribe();
  }
}
