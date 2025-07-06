import { EntityState } from '@ngrx/entity';
import { BackendErrorsInterface } from 'libs/interfaces/src/lib/backend-errors/backend.errors.interface';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';




export interface ProfileStateInterface extends EntityState<Profile> {
  isProfileLoaded: boolean;
  currentUser: Profile | null;
  backendErrors: BackendErrorsInterface | null;
}
