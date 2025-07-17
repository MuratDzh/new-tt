import { Profile } from '@tt/interfaces/profile'



export interface CurrentUserStateInterface {
  isMeLoaded: boolean;
  me: Profile | null;
}
