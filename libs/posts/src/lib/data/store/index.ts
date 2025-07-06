import * as PostEffects from './postStore/post.effects';
import { PostActions } from './postStore/post.actions';
import { getPostResolver } from './postStore/post.resolver';
import { PostsStateInterface, PostsFromUsersInterface } from './postStore/postState.interface';
import { currentPostActions } from './myPostStore/currentUserPost.actions';
import * as CurrentUserPostsEffect from './myPostStore/currentUserPosts.effects';
import { CurrentPostInterface } from './myPostStore/currentUserPosts.interface';
import { CommentsActions } from './commentsStore/comments.actions';
import * as CommentsEffect  from './commentsStore/comments.effect';
import {
  PostsFromUsersReducer,
  selectPostsEntities,
  selectPostsIds,
  selectPostsFromUsersState,
  PostsFromUsersKey,
} from './postStore/post.reducer';
import {
  CurrentUserPostsKey,
  CurrentUserPostsReducer,
  selectCurrentPostEntities,
  selectCurrentPostIds,
  selectCurrentPostState,
} from './myPostStore/currentUserPosts.reducer';
import { CommentsFeatureReducer,selectCommentsState, CommentsReducerKey, selectCommentsEntities, selectCommentsIds } from './commentsStore/comments.reducer';
import { CommentState } from './commentsStore/comments.state.interface';

export {
  PostActions,
  PostEffects,
  PostsFromUsersKey,
  PostsFromUsersReducer,
  selectPostsEntities,
  selectPostsIds,
  selectPostsFromUsersState,
  getPostResolver,
  PostsStateInterface,
  PostsFromUsersInterface,
  currentPostActions,
  CurrentUserPostsEffect,
 
  CurrentPostInterface,
  CurrentUserPostsKey,
  CurrentUserPostsReducer,
  selectCurrentPostEntities,
  selectCurrentPostState,
  selectCurrentPostIds,
    
  
};

export {
  CommentsActions,
  CommentsEffect,
  CommentsReducerKey,
  CommentsFeatureReducer,
  selectCommentsEntities,
  selectCommentsIds,
  selectCommentsState,
  CommentState
};