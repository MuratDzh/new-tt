import { EntityState } from '@ngrx/entity';
import { PostRes } from '../../../data/interfces/post.interface.ts';
import { BackendErrorsInterface } from '../../../data/interfces/backend.errors.interface';

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
