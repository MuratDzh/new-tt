import { Profile } from '@tt/interfaces/profile';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';

import { Subscribers } from '@tt/interfaces/subscribers';
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
