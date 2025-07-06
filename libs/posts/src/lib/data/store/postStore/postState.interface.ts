import { EntityState } from '@ngrx/entity';
import { PostRes } from '../../interfaces/post.interface.ts.js';
import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface.js';

export interface PostsStateInterface {
  id: number | string | null;
  isPostLoaded: boolean;
  backendErrors: BackendErrorsInterface | null;
  posts: PostRes[] | null;
}

export interface PostsFromUsersInterface
  extends EntityState<PostsStateInterface | null> {
  backendErrors: BackendErrorsInterface | null;
}
