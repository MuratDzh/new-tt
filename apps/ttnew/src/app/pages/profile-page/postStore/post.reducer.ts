import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  CommentsRes,
  PostRes,
} from '../../../data/interfces/post.interface.ts';
import {
  PostsFromUsersInterface,
  PostsStateInterface,
} from './postState.interface';
import {
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { PostActions } from './post.actions.js';
import { Subscribers } from '../../../data/interfces/subscribers.interfase';
import { Profile } from '../../../data/interfces/profile.interface';

const adapter: EntityAdapter<PostsStateInterface | null> =
  createEntityAdapter<PostsStateInterface | null>();

const PostsFromUsersInitialState: PostsFromUsersInterface =
  adapter.getInitialState({ backendErrors: null });

const PostsFromUsersFeatureReducer = createFeature({
  name: 'PostsFromUsers',
  reducer: createReducer(
    PostsFromUsersInitialState,
    on(PostActions.postLoadSuccess, (state, action) => {
      return adapter.addOne(action.posts, { ...state });
    }),
    on(PostActions.postLoadFealure, (state, action) => ({
      ...state,
      backendErrors: action.errors,
    })),
    on(PostActions.myPostsUpdatedSuccess, (state, action) => {
      console.log('РЕДУСЕР', action.posts.changes);
      return adapter.updateOne(action.posts, { ...state });
    })
    // on(PostActions.myPostsUpdatedSuccessAfterNewComment, (state, action) => {
    //     console.log("РЕДУСЕР New", action.comment.changes);
    //       return adapter.updateOne(action.comment, { ...state });
    //   }),
  ),
});

export const {
  name: PostsFromUsersKey,
  reducer: PostsFromUsersReducer,
  selectEntities: selectPostsEntities,
  selectIds: selectPostsIds,
  selectPostsFromUsersState,
} = PostsFromUsersFeatureReducer;
