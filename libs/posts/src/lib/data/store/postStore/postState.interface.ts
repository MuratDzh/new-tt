import { EntityState } from '@ngrx/entity';
import { PostRes } from '../../interfaces/post.interface';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';

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
