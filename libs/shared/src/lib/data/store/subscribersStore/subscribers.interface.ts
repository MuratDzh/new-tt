import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';
import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface';

import { Subscribers } from '../../../../../../interfaces/src/lib/subscribers/subscribers.interfase';
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
