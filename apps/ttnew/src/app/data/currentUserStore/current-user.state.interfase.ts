import { Profile } from '../interfces/profile.interface';

export interface CurrentUserStateInterface {
  isMeLoaded: boolean;
  me: Profile | null;
}
