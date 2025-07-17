import { EntityState } from '@ngrx/entity';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { Profile } from '@tt/interfaces/profile';




export interface ProfileStateInterface extends EntityState<Profile> {
  isProfileLoaded: boolean;
  currentUser: Profile | null;
  backendErrors: BackendErrorsInterface | null;
}
