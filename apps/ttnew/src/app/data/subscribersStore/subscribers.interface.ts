import { BackendErrorsInterface } from '../interfces/backend.errors.interface';
import { Profile } from '../interfces/profile.interface';
import { Subscribers } from '../interfces/subscribers.interfase';
import { EntityState } from '@ngrx/entity';

export interface SubscribersStateInterface
  extends EntityState<SubEntities | null> {}
export interface SubEntities extends Subscribers<Profile> {
  items: Profile[];
  // total: number;
  // page: number;
  // size: number;
  // pages: number;
  idSub: number;
  isLoaded: boolean;
  errors: BackendErrorsInterface | null;
}
