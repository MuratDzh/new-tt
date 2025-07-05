import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';

import { map, Observable, switchMap, of, tap, pluck, filter } from 'rxjs';
import { Profile } from '../../data/interfces/profile.interface';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { select, Store } from '@ngrx/store';
import { selectMe } from '../../data/currentUserStore/current-user.reducer';
import { SlicePipe } from '../../helpers/pipes/slice.pipe';

import { selectEntities } from './profileStore/profile.reducer';
import { selectSubscriptionsState } from '../../data/subscriptionsStore/subscriptions.reducer';
import { ProfileService } from '../../data/services/profile.service';
import { SubscriptionsActions } from '../../data/subscriptionsStore/subscriptions.actions';
import {
  selectSubscribers,
  selectSubscribersIds,
  selectSubscribersState,
} from '../../data/subscribersStore/subscribers.reducer';
import { Dictionary } from '@ngrx/entity';
import { Subscribers } from '../../data/interfces/subscribers.interfase';
import { SubEntities } from '../../data/subscribersStore/subscribers.interface';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ImgPipe,
    CommonModule,
    RouterLink,
    PostFeedComponent,
    SlicePipe,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  profile$!: Observable<Profile | null | undefined>;
  subscribers$!: Observable<Profile[]>;

  subscribersEntity$!: Observable<SubEntities>;
  currentUserId!: number | string;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.subscribersEntity$ = this.route.params.pipe(
      switchMap(({ id }) => {
        if (id !== 'me') {
          return this.store
            .select(selectSubscribers)
            .pipe(map((v) => v[id] as SubEntities));
        } else {
          return this.store.select(selectMe).pipe(
            switchMap((me) => {
              return this.store.select(selectSubscribers).pipe(
                // filter(v=>!!v),
                map((v) => {
                  return v[(me as Profile).id] as SubEntities;
                })
              );
            })
          );
        }
      })
    );

    this.profile$ = this.route.params.pipe(
      switchMap((v) => {
        if (v['id'] !== 'me') {
          return this.store.pipe(
            select(selectEntities),
            filter((v) => !!v),
            map((p) => {
              return p[v['id']];
            })
          );
        } else {
          return this.store.select(selectMe);
        }
      })
    );
  }

  onUnsubscribe(profile: Profile) {
    console.log('DELETE, profile', profile);
    return this.store.dispatch(SubscriptionsActions.unsubscribe({ profile }));
  }

  onSubscribe(profile: Profile) {
    console.log('SUBSCRIBE, profile', profile);
    return this.store.dispatch(SubscriptionsActions.subscribe({ profile }));
  }
}
