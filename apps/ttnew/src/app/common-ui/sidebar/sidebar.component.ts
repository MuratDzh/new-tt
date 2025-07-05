import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SvgDirective } from '../../helpers/directives/svg.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubscriberCardComponent } from '../subscriber-card/subscriber-card.component';
import { ProfileService } from '../../data/services/profile.service';
import { Profile } from '../../data/interfces/profile.interface';
import { map, Observable, of, Subscription } from 'rxjs';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
import { select, Store } from '@ngrx/store';
import { selectMe } from '../../data/currentUserStore/current-user.reducer';
import { selectSubscribers } from '../../data/subscribersStore/subscribers.reducer';
import { Subscribers } from '../../data/interfces/subscribers.interfase';
import { SlicePipe } from '../../helpers/pipes/slice.pipe';
import { selectSubscriptionsState } from '../../data/subscriptionsStore/subscriptions.reducer';

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
export class SidebarComponent implements OnInit, OnDestroy {
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    // this.subscribers$ = this.store.pipe(
    //   select(selectSubscribers),
    //   map((sub) => (sub ? sub. : null))
    // );

    this.subscriptions$ = this.store
      .select(selectSubscriptionsState)
      .pipe(map((v) => v.items));

    this.subscriptionsTotal$ = this.store
      .select(selectSubscriptionsState)
      .pipe(map((v) => v.total));

    // this.meSubscription = this.service.getMe().subscribe((v) => (this.me = v));
    this.meSubscription = this.store
      .select(selectMe)
      .subscribe((v) => (this.me = v));
  }

  ngOnDestroy(): void {
    this.meSubscription?.unsubscribe();
  }
}
