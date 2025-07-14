import { EntityState } from '@ngrx/entity';
import { PostRes } from '../../interfaces/post.interface.js';

export interface CurrentPostInterface extends EntityState<PostRes | null> {
  isLoaded: boolean;
}
