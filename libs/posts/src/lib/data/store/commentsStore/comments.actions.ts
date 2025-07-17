import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CommentInt,
  CommentsRes,
  CommentsResFull,
} from '../../interfaces/post.interface.js';
import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';
import { Update } from '@ngrx/entity';

export const CommentsActions = createActionGroup({
  source: 'Profile Page',
  events: {
    'Create Comment': props<{
      comment: CommentInt | null;
      postAuthorId: number | string;
    }>(),
    'Create Comment Success': props<{ comment: CommentsRes | null }>(),
    'Create Comment Fealure': props<{ errors: BackendErrorsInterface }>(),

    'Get Comment By Id': props<{ comment: CommentsRes }>(),
    'Get Comment By Id Success': props<{ comment: CommentsResFull | null }>(),
    'Get Comment By Id Fealure': props<{ errors: BackendErrorsInterface }>(),

    'Update Comment': props<{
      comment: CommentInt | null;
      postAuthorId: number | string;
    }>(),
    'Update Comment Success': props<{ comment: Update<CommentsRes | null> }>(),
    'Update Comment Fealure': props<{ errors: BackendErrorsInterface }>(),

    'Delete Comment': props<{
      comment: CommentsRes;
      postAuthorId: number | string;
    }>(),
    'Delete Comment Success': emptyProps(),
    'Delete Comment Fealure': props<{ errors: BackendErrorsInterface }>(),
  },
});
