
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { PostRes } from '../../interfaces/post.interface';
import { CurrentPostInterface } from './currentUserPosts.interface';
import { createFeature, createReducer, on, props } from '@ngrx/store';
import { currentPostActions } from './currentUserPost.actions';


const adapter: EntityAdapter<PostRes | null> =
  createEntityAdapter<PostRes | null>();
const CurrentPostState: CurrentPostInterface = adapter.getInitialState({
  isLoaded: false,
});

const CurrentPostFeatureReducer = createFeature({
  name: 'CurrentPost',
  reducer: createReducer(
    CurrentPostState,
    on(currentPostActions.getCurrentPostSuccess, (state, action) => {
      return adapter.addOne(action.post, { ...state, isLoaded: true });
    }),
    on(currentPostActions.updateMyPostsPropSuccess, (state, action) => {
      return adapter.updateOne(action.post, { ...state });
    }),
    on(currentPostActions.updateMyPostSuccess, (state, action) => {
      return adapter.updateOne(action.post, { ...state });
    }),
    on(currentPostActions.createPostSuccess, (state, action) => {
      return adapter.addOne(action.post, state);
    }),
    on(currentPostActions.delPost, (state, action) => {
      console.log('REDUCER, id', action.post?.id);

      return adapter.removeOne(action.post!.id, { ...state });
    })
  ),
});

export const {
  name: CurrentUserPostsKey,
  reducer: CurrentUserPostsReducer,
  selectEntities: selectCurrentPostEntities,
  selectCurrentPostState,
  selectIds: selectCurrentPostIds,
} = CurrentPostFeatureReducer;
