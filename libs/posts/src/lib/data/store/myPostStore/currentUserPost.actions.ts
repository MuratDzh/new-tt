import { Post } from '../../interfaces/post.interface.ts.js';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface.js';

import { PostRes } from '../../interfaces/post.interface.ts.js';
import { Update } from '@ngrx/entity';
import { PostsStateInterface } from '../postStore/postState.interface.js';

export const currentPostActions = createActionGroup({
  source: 'Profile Page',
  events: {
    'Get Current Post': props<{ id: number }>(),
    'Get Current Post Success': props<{ post: PostRes | null }>(),
    'Get Current Post Fealure': props<{
      errors: BackendErrorsInterface;
    }>(),
    'Update My Post': props<{ post: Post; id: number }>(),
    'Update My Post Success': props<{ post: Update<PostRes | null> }>(),

    //'Update My Posts Prop Success' нужен для того, чтобы изменить флаг isUpdated,
    //иначе в инпут попадают старые данные и updatedPost не обнуляется
    'Update My Posts Prop Success': props<{ post: Update<PostRes | null> }>(),
    'Update My Post Fealure': props<{
      errors: BackendErrorsInterface;
    }>(),

    'Create Post': props<{ post: Post }>(),
    'Create Post Success': props<{ post: PostRes | null }>(),
    'Create Post Fealure': props<{ errors: BackendErrorsInterface }>(),

    'Del Post': props<{ post: PostRes | null }>(),
    // 'Del Post Success': props<{ posts: Update<PostRes[] | null> }>(),
    'Del Post Success': emptyProps(),
    'Del Post Fealure': props<{ errors: BackendErrorsInterface }>(),
  },
});
