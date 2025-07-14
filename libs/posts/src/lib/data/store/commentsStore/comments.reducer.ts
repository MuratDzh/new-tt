import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { CommentState } from './comments.state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CommentsActions } from './comments.actions';
import { CommentsRes } from '../../interfaces/post.interface';

export const adapter: EntityAdapter<CommentsRes | null> = createEntityAdapter();
export const CommentsInitState: CommentState = adapter.getInitialState({});

const CommentsReducer = createFeature({
  name: 'Comments',
  reducer: createReducer(
    CommentsInitState,
    on(CommentsActions.createCommentSuccess, (state, action) => {
      return adapter.addOne(action.comment, state);
    }),
    on(CommentsActions.deleteComment, (state, action) => {
      return adapter.removeOne(action.comment.id, state);
    }),
    on(CommentsActions.updateCommentSuccess, (state, action) => {
      return adapter.updateOne(action.comment, state);
    })
  ),
});

export const {
  name: CommentsReducerKey,
  reducer: CommentsFeatureReducer,
  selectEntities: selectCommentsEntities,
  selectIds: selectCommentsIds,
  selectCommentsState,
} = CommentsReducer;
