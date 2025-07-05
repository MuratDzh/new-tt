import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Profile } from '../../data/interfces/profile.interface';
import { ProfileFilterComponent } from './profile-filter/profile-filter.component';
import { Store } from '@ngrx/store';
import {
  selectAccounts,
  selectIsAccountsLoaded,
} from './AccountsStore/accounts.reducer';
import {
  selectFilteredAccounts,
  selectIsFilteredAccountsLoaded,
} from './profile-filter/FilterAccountsStore/filter-accounts.reducer';
import { ProfileService } from '../../data/services/profile.service';
import {
  SubscriptionsActions,
  UpdateStorsAfterSubscrube,
} from '../../data/subscriptionsStore/subscriptions.actions';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ProfileCardComponent, CommonModule, ProfileFilterComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  acc$!: Observable<Profile[] | null>;

  isAccLoaded$!: Observable<boolean>;

  constructor(private store: Store, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.acc$ = this.store
      .select(selectAccounts)
      .pipe(map((v) => (v ? v.items : null)));
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
    this.store.dispatch(SubscriptionsActions.subscribe({ profile }));
    this.store.dispatch(
      UpdateStorsAfterSubscrube.updateStorsAfterSubscribe({ profile })
    );
  }

  onUnsubscribe(profile: Profile) {
    // profile.isSubscribed=false
    this.store.dispatch(SubscriptionsActions.unsubscribe({ profile })),
      this.store.dispatch(
        UpdateStorsAfterSubscrube.updateStorsAfterUnsubscribe({ profile })
      );
  }

  onSendMessage(profile: Profile) {}
}
