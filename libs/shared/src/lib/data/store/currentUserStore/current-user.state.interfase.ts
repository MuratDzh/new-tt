import { Profile } from "libs/interfaces/src/lib/profile/profile.interface";



export interface CurrentUserStateInterface {
  isMeLoaded: boolean;
  me: Profile | null;
}
