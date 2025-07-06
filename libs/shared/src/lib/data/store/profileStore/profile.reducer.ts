import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfileStateInterface } from './profileState.interface';
import { ProfileActions } from './profile.actions';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';



const adapter: EntityAdapter<Profile> = createEntityAdapter<Profile>();

const ProfileInitialState: ProfileStateInterface = adapter.getInitialState({
  isProfileLoaded: false,
  currentUser: null,
  backendErrors: null,
});

const ProfileFeatureReducer = createFeature({
  name: 'Profile',
  reducer: createReducer(
    ProfileInitialState,

    on(ProfileActions.loadProfileSuccess, (state, action) => {
      return adapter.addOne(action.profile, {
        ...state,
        isProfileLoaded: true,
      });
    }),
    on(
      ProfileActions.loadProfileSuccessAfterSubscribeChanged,
      (state, action) => {
        return adapter.updateOne(action.profile, state);
      }
    ),

    on(ProfileActions.loadCurrentProfileSuccess, (state, action) => {
      return { ...state, isProfileLoaded: true, currentUser: action.profile };
    }),

    on(ProfileActions.loadProfileFailure, (state, action) => ({
      ...state,
      backendErrors: action.errors,
      isProfileLoaded: false,
      profile: null,
    }))
  ),
});

export const {
  name: ProfileReducerKey,
  reducer: ProfileReducer,
  selectIds: selectProfileIds,
  selectEntities: selectProfileEntities,
  selectIsProfileLoaded,
  selectCurrentUser,
} = ProfileFeatureReducer;
