import { EntityState } from '@ngrx/entity';
import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';
import { Profile } from '../../../data/interfces/profile.interface';

export interface ProfileStateInterface extends EntityState<Profile> {
  isProfileLoaded: boolean;
  currentUser: Profile | null;
  backendErrors: BackendErrorsInterface | null;
}
