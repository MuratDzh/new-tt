import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileHeaderComponent } from './../ui/profile-header';

import { map, Observable, switchMap, of, tap, pluck, filter } from 'rxjs';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImgPipe } from '@tt/common-ui';

import { select, Store } from '@ngrx/store';

import {
  selectSubscribers,
  selectMe,
  ProfileService,
  selectProfileEntities,
  SubscriptionsActions,
  SubEntities,
  CurrentUserActions,
} from '@tt/shared';

import { PostFeedComponent } from '@tt/posts';
import { SlicePipe } from '../data/pipes';
import { Profile } from '@tt/interfaces/profile';
import { ChatsService } from '../../../../chat/src/lib/data/services/chats.service';

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
    private profileService: ProfileService,
    private chatsService: ChatsService,
    private router: Router
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
            select(selectProfileEntities),
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

  onCreateChat(id: number) {
    this.chatsService.postChat(id).pipe(
      tap((chat)=>this.router.navigate(['chats', `${chat.id}`])
    )).subscribe()
  }
}
