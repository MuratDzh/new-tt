import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../../../data/services/post.service';
import { PostActions } from './post.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { PostsStateInterface } from './postState.interface';
import { Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';

let currentUserId: string | number;

export const PostEffects = createEffect(
  (
    actions$ = inject(Actions),
    postService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(PostActions.postLoad),
      tap((id) => (currentUserId = id.id)),
      switchMap((id) => {
        return postService.getPosts(id.id);
      }),

      map((posts) => {
        let postsLoaded: PostsStateInterface = {
          id: posts[0] ? posts[0].author.id : currentUserId,
          isPostLoaded: true,
          posts: posts,
          backendErrors: null,
        };

        return PostActions.postLoadSuccess({ posts: postsLoaded });
      }),
      catchError((errors) => {
        console.log('ERRORS', errors);

        return of(PostActions.postLoadFealure({ errors }));
      })
    );
  },
  { functional: true }
);
