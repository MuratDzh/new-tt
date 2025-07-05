import { createFeature, createReducer, on } from '@ngrx/store';
import { CurrentUserActions } from './current-user.actions';
import { Profile } from '../interfces/profile.interface';
import { CurrentUserStateInterface } from './current-user.state.interfase';

const CurrentUserInitialState: CurrentUserStateInterface = {
  isMeLoaded: false,
  me: null,
};

const CurrentUserFeature = createFeature({
  name: 'CurrentUser',
  reducer: createReducer(
    CurrentUserInitialState,
    on(CurrentUserActions.getMeSuccess, (state, action) => ({
      ...state,
      isMeLoaded: true,
      me: action.me,
    }))
  ),
});

export const {
  name: CurrentUserFeatureKey,
  reducer: CurrentUserReducer,
  selectMe,
  selectIsMeLoaded,
} = CurrentUserFeature;
