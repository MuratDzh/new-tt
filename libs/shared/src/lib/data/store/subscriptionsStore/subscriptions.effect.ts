import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ProfileService } from '../../services/profile-service/profile.service';
import {
  SubscriptionsActions,
  UpdateStorsAfterSubscrube,
} from './subscriptions.actions';
import { catchError, filter, first, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Subscribers } from '@tt/interfaces/subscribers';


import { Update } from '@ngrx/entity';
import { AccountsActions } from '../AccountsStore/accounts.actions';
import { selectAccounts } from '../AccountsStore/accounts.reducer';

import { ProfileActions } from '../profileStore';
import { FilterAccountsActions } from '../FilterAccountsStore/filter-accounts.actions';
import { Profile } from '@tt/interfaces/profile';
import { selectFilteredAccounts } from '../FilterAccountsStore';

export const SubscriptionsEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
    return actions$.pipe(
      ofType(SubscriptionsActions.loadMySubscriptions),
      switchMap(() => {
        return profileService.getSubscription();
      }),
      map((profiles) => {
        profiles.items = profiles.items!.map((v) => ({
          ...v,
          isSubscribed: true,
        }));
        return SubscriptionsActions.loadMySubscriptionsSuccess({ profiles });
      }),
      catchError((errors) =>
        of(SubscriptionsActions.loadMySubscriptionsFailure({ errors }))
      )
    );
  },
  { functional: true }
);

export const SubscribeEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(SubscriptionsActions.subscribe),
      switchMap(({ profile }) => {
        newProfile = profile;
        return profileService.toSubscribe(profile);
      }),
      map((_) => {
        newProfile = { ...newProfile, isSubscribed: true };
        return SubscriptionsActions.subscribeSuccess({ profile: newProfile });
      }),
      catchError((errors) =>
        of(SubscriptionsActions.subscribeFailure({ errors }))
      )
    );
  },
  { functional: true }
);

export const AfterSubscribeUpdateProfileStoreEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(SubscriptionsActions.subscribeSuccess),
      switchMap(({ profile }) => {
        newProfile = profile;
        return of(profile);
      }),
      map((v) => {
        newProfile = { ...newProfile, isSubscribed: true };

        let updatedProfile: Update<Profile> = {
          id: newProfile.id,
          changes: newProfile,
        };

        store.dispatch(
          ProfileActions.loadCurrentProfileSuccess({ profile: newProfile })
        );
        return ProfileActions.loadProfileSuccessAfterSubscribeChanged({
          profile: updatedProfile,
        });
      })
    );
  },
  { functional: true }
);

export const AfterSubscribeUpdateAllAccountsStoreEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(UpdateStorsAfterSubscrube.updateStorsAfterSubscribe),
      switchMap(({ profile }) => {
        newProfile = profile;
        return store.select(selectAccounts).pipe(
          filter((v) => !!v),
          first()
        );
      }),
      map((accounts) => {
        newProfile = { ...newProfile, isSubscribed: true };

        accounts = {
          ...accounts,
          items: [
            ...((accounts as Subscribers<Profile>).items as Profile[]).map(
              (v) => (v.id === newProfile.id ? (v = newProfile) : v)
            ),
          ],
        } as Subscribers<Profile>;

        let updatedProfile: Update<Profile> = {
          id: newProfile.id,
          changes: newProfile,
        };

        store.dispatch(AccountsActions.loadAllAccountsSuccess({ accounts }));

        return UpdateStorsAfterSubscrube.updateStorsSuccess();
      })
    );
  },
  { functional: true }
);

export const AfterSubscribeUpdateFilterAccountsStoreEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(UpdateStorsAfterSubscrube.updateStorsAfterSubscribe),
      switchMap(({ profile }) => {
        newProfile = profile;
        return store.select(selectFilteredAccounts).pipe(
          filter((v) => !!v),
          first()
        );
      }),
      map((accounts) => {
        newProfile = { ...newProfile, isSubscribed: true };

        let t = JSON.parse(JSON.stringify(accounts));
        // console.log("---t---",t)

        t.items = t.items.map((v: Profile) =>
          v.id === newProfile.id ? (v = newProfile) : v
        );

        // accounts={ ...accounts, items: [...((accounts as Subscribers<Profile>)
        //     .items as Profile[])
        //     .map(v=>v.id===newProfile.id? v=newProfile : v)]} as Subscribers<Profile>

        store.dispatch(
          FilterAccountsActions.filterAccountsSuccess({ accounts: t })
        );

        return UpdateStorsAfterSubscrube.updateStorsSuccess();
      })
    );
  },
  { functional: true }
);

export const UnsubscribeEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(SubscriptionsActions.unsubscribe),
      switchMap(({ profile }) => {
        newProfile = profile;
        return profileService.toUnsubscribe(profile);
      }),
      map(() => {
        newProfile = { ...newProfile, isSubscribed: false };

        return SubscriptionsActions.unsubscribeSuccess({ profile: newProfile });
      })
    );
  },
  { functional: true }
);

export const AfterUnsubscribeUpdateProfileStoreEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(SubscriptionsActions.unsubscribeSuccess),
      switchMap(({ profile }) => {
        newProfile = profile;
        return of(profile);
      }),
      map((v) => {
        newProfile = { ...newProfile, isSubscribed: false };

        let updatedProfile: Update<Profile> = {
          id: newProfile.id,
          changes: newProfile,
        };

        store.dispatch(
          ProfileActions.loadCurrentProfileSuccess({ profile: newProfile })
        );

        return ProfileActions.loadProfileSuccessAfterSubscribeChanged({
          profile: updatedProfile,
        });
      })
    );
  },
  { functional: true }
);

export const AfterUnsubscribeUpdateAllAccountsStoreEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(UpdateStorsAfterSubscrube.updateStorsAfterUnsubscribe),
      switchMap(({ profile }) => {
        newProfile = profile;
        return store.select(selectAccounts).pipe(
          filter((v) => !!v),
          first()
        );
      }),
      map((accounts) => {
        newProfile = { ...newProfile, isSubscribed: false };

        accounts = {
          ...accounts,
          items: [
            ...((accounts as Subscribers<Profile>).items as Profile[]).map(
              (v) => (v.id === newProfile.id ? (v = newProfile) : v)
            ),
          ],
        } as Subscribers<Profile>;

        let updatedProfile: Update<Profile> = {
          id: newProfile.id,
          changes: newProfile,
        };

        store.dispatch(AccountsActions.loadAllAccountsSuccess({ accounts }));
        return UpdateStorsAfterSubscrube.updateStorsSuccess();
      })
    );
  },
  { functional: true }
);

export const AfterUnsubscribeUpdateFilterAccountsStoreEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let newProfile: Profile;
    return actions$.pipe(
      ofType(UpdateStorsAfterSubscrube.updateStorsAfterUnsubscribe),
      switchMap(({ profile }) => {
        newProfile = profile;
        return store.select(selectFilteredAccounts).pipe(
          filter((v) => !!v),
          first()
        );
      }),
      map((accounts) => {
        newProfile = { ...newProfile, isSubscribed: false };

        accounts = {
          ...accounts,
          items: [
            ...((accounts as Subscribers<Profile>).items as Profile[]).map(
              (v) => (v.id === newProfile.id ? (v = newProfile) : v)
            ),
          ],
        } as Subscribers<Profile>;

        let updatedProfile: Update<Profile> = {
          id: newProfile.id,
          changes: newProfile,
        };
        store.dispatch(
          FilterAccountsActions.filterAccountsSuccess({ accounts })
        );

        return UpdateStorsAfterSubscrube.updateStorsSuccess();
      })
    );
  },
  { functional: true }
);
