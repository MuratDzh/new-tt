import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { PostsStateInterface } from './postState.interface';
import { Update } from '@ngrx/entity';
import { CommentsRes, PostRes } from '../../interfaces/post.interface';

export const PostActions = createActionGroup({
  source: 'Profile Page Resolver',
  events: {
    'Post Load': props<{ id: number | string }>(),
    'Post Load Success': props<{ posts: PostsStateInterface | null }>(),
    // "Post Load Success": props<{posts: PostRes[]}>(),
    'Post Load Fealure': props<{ errors: BackendErrorsInterface }>(),
    'My Posts Update': emptyProps(),

    //'My Posts Updated Success' для обновления списка постов после редактирования одного
    'My Posts Updated Success': props<{
      posts: Update<PostsStateInterface | null>;
    }>(),

    //'My Posts Updated Success' для обновления списка постов после редактирования одного
    'My Posts Updated Success After New Comment': props<{
      comment: Update<CommentsRes | null>;
    }>(),

    'Del My Post': props<{ post: PostRes | null }>(),
    'Del My Post Success': emptyProps(),
    'Del My Post Fealure': props<{ errors: BackendErrorsInterface }>(),
  },
});
