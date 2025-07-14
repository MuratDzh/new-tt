import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { currentPostActions } from './currentUserPost.actions';
import { map, switchMap, of, tap, catchError } from 'rxjs';
import { Store } from '@ngrx/store';

import { PostService } from '../../services/post.service';
import { Update } from '@ngrx/entity';
import { PostRes } from '../../interfaces/post.interface';
import {
  selectCurrentPostEntities,
} from './currentUserPosts.reducer';
import { PostActions } from '../postStore/post.actions';
import { PostsStateInterface } from '../postStore/postState.interface';
import { selectMe } from '@tt/shared';

let myId: number;
let postToDel: PostRes | null;

export const CurrentUserPostsEffect = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    postService = inject(PostService)
  ) => {
    return actions$.pipe(
      ofType(currentPostActions.getCurrentPost),
      switchMap((id) => {
        let post: PostRes | null = null;
        store.select(selectCurrentPostEntities).subscribe((v) => {
          return (post = v[id.id] ? (v[id.id] as PostRes) : null);
        });
        if (post !== undefined && post !== null) {
          console.log('ЕСТЬ В СТОРЕ', post);
          return store
            .select(selectCurrentPostEntities)
            .pipe(map((v) => v[(post as PostRes).id]));
        }
        console.log('НЕТ В СТОРЕ', post);
        return postService.getPostById(id.id);
      }),
      map((post) => {
        return currentPostActions.getCurrentPostSuccess({
          post: post as PostRes,
        });
      })
    );
  },
  { functional: true }
);

export const UpdateMyPostsEffect = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    postService = inject(PostService)
  ) => {
    return actions$.pipe(
      ofType(currentPostActions.updateMyPost),
      switchMap(({ post, id }) => {
        return postService.updatePost(post, id);
      }),
      map((post) => {
        let isUpd: boolean | undefined;
        store
          .select(selectCurrentPostEntities)
          .pipe(map((v) => v[post.id]))
          .subscribe((v) => (isUpd = v?.isUpdate));
        console.log('IsUpdated', post.isUpdate);

        let update: Update<PostRes | null> = {
          id: post.id,
          changes: {
            ...post,
            isUpdate: isUpd ? false : true,
          },
        };
        console.log('IsUpdated2', post.isUpdate);

        return currentPostActions.updateMyPostSuccess({ post: update });
      })
    );
  },
  { functional: true }
);

export const updateMyPostsEffects = createEffect(
  (
    actions$ = inject(Actions),
    postService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(currentPostActions.updateMyPostSuccess),

      switchMap((post) => {
        return postService.getPosts(post.post.changes?.author?.id as number);
      }),

      map((posts) => {
        let postsLoaded: PostsStateInterface = {
          id: posts[0].author.id,
          isPostLoaded: true,
          posts: posts,
          backendErrors: null,
        };

        let update: Update<PostsStateInterface | null> = {
          id: posts[0].author.id as number,
          changes: postsLoaded,
        };

        console.log('CURRENT USER EFFECT', update);

        return PostActions.myPostsUpdatedSuccess({ posts: update });
      })
    );
  },
  { functional: true }
);

export const CreatePostEffect = createEffect(
  (actions$ = inject(Actions), postService = inject(PostService)) => {
    return actions$.pipe(
      ofType(currentPostActions.createPost),
      switchMap((post) => {
        return postService.createPost(post.post);
      }),
      map((post) => {
        return currentPostActions.createPostSuccess({ post: post });
      })
    );
  },
  { functional: true }
);

export const updateMyPostsAfterNewPostEffects = createEffect(
  (
    actions$ = inject(Actions),
    postService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(currentPostActions.createPostSuccess),

      switchMap((post) => {
        return postService.getPosts(post.post?.author.id as number);
      }),

      map((posts) => {
        let postsLoaded: PostsStateInterface = {
          id: posts[0].author.id,
          isPostLoaded: true,
          posts: posts,
          backendErrors: null,
        };

        let update: Update<PostsStateInterface | null> = {
          id: posts[0].author.id as number,
          changes: postsLoaded,
        };

        console.log('CURRENT USER EFFECT', update);

        return PostActions.myPostsUpdatedSuccess({ posts: update });
      })
    );
  },
  { functional: true }
);

export const DelPostEffect = createEffect(
  (
    actions$ = inject(Actions),
    posService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(currentPostActions.delPost),
      tap((post) => store.dispatch(PostActions.delMyPost({ post: post.post }))),
      tap((post) => (postToDel = post.post)),
      switchMap((post) => {
        return posService.delPost(post.post!);
      }),
      map(() => {
        return currentPostActions.delPostSuccess();
      }),
      catchError((errors) => of(currentPostActions.delPostFealure({ errors })))
    );
  },
  { functional: true }
);

export const UpdateMyPostsAfterDelEffect = createEffect(
  (
    actions$ = inject(Actions),
    posService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(currentPostActions.delPostSuccess),

      tap(() => {
        store
          .select(selectMe)
          .pipe(map((v) => v!.id))
          .subscribe((v) => (myId = v));
      }),
      switchMap(() => {
        console.log('Current USER POST EFFECT, myId', myId);

        return posService.getPosts(myId);
      }),
      map((posts) => {
        let postsLoaded: PostsStateInterface = {
          id: posts[0].author.id,
          isPostLoaded: true,
          posts: posts,
          backendErrors: null,
        };

        let updatedPostList: Update<PostsStateInterface | null> = {
          id: myId,
          changes: postsLoaded,
        };

        return PostActions.myPostsUpdatedSuccess({ posts: updatedPostList });
      }),
      catchError((errors) => of(currentPostActions.delPostFealure({ errors })))
    );
  },
  { functional: true }
);
