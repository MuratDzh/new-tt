import { EntityState } from '@ngrx/entity';
import { PostRes } from '../../../data/interfces/post.interface.ts.js';

export interface CurrentPostInterface extends EntityState<PostRes | null> {
  isLoaded: boolean;
}
