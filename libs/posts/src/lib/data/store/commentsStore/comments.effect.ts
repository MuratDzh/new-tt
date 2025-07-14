import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../../../data/services/post.service';
import { Store } from '@ngrx/store';
import { CommentsActions } from './comments.actions';
import { firstValueFrom, map, switchMap, tap } from 'rxjs';

import { selectPostsEntities } from '../postStore/post.reducer';
import { PostsStateInterface } from '../postStore/postState.interface';
import { Update } from '@ngrx/entity';
import { PostActions } from '../postStore/post.actions';

import { CommentInt, CommentsRes, CommentsResFull, PostRes } from '../../interfaces/post.interface';

let authorId: string | number;
let myComment: CommentsRes;

export const GetCommentsEffect = createEffect(
  (
    actions$ = inject(Actions),
    postService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(CommentsActions.getCommentById),
      switchMap(({ comment }) => {
        // return postService.getCommentById(id.id)
        console.log(comment);
        return store.select(selectPostsEntities).pipe(
          map((v) => {
            console.log(
              'switchMap',
              v
              //   [comment]?.posts
              // ?.filter(
              // ({id})=>id==comment.postId)[0]
              // .comments.filter(com=>com.id==comment.id)
            );

            return v[comment.author.id]!.posts!.filter(
              ({ id }) => id == comment.postId
            )[0].comments.filter((com) => com.id == comment.id)[0];
          })
        );
      }),
      map((comment) => {
        let com: CommentsResFull | null = {
          ...comment,
        };
        return CommentsActions.getCommentByIdSuccess({ comment: com });
      })
    );
  },
  { functional: true},

);

export const CreateCommentEffect = createEffect(
  (
    actions$ = inject(Actions),
    postService = inject(PostService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(CommentsActions.createComment),
      tap(({ postAuthorId }) => {
        authorId = postAuthorId;
      }),

      switchMap(({ comment }) => {
        console.log('AuthorId', authorId);
        return postService.createCommentAction(comment as CommentInt);
      }),
      map((comment) => {
        return CommentsActions.createCommentSuccess({ comment });
      })
    );
  },
  { functional: true }
);

export const UpdatePostsStoreAfterCreateComment = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let myPosts: PostRes[];
    let myComment: CommentsRes;

    return actions$.pipe(
      ofType(CommentsActions.createCommentSuccess),
      switchMap(({ comment }) => {
        myComment = comment as CommentsRes;
        return firstValueFrom(
          store.select(selectPostsEntities).pipe(
            map((v) => {
              return v[authorId!]!.posts as PostRes[];
            }),
            map((posts: PostRes[]) => {
              myPosts = posts;
              return posts.filter((v) => v.id == comment!.postId)[0].comments;
            })
          )
        );
      }),
      map((comments) => {
        let post: PostRes = {
          ...myPosts!.filter((v) => v.id == myComment.postId)[0],
          comments: [...comments, myComment],
        };

        myPosts = myPosts.map((v) =>
          v.id === myComment.postId ? (v = post) : v
        );

        let updatedPosts: PostsStateInterface = {
          id: myPosts![0].author.id,
          isPostLoaded: true,
          posts: [...myPosts!],
          backendErrors: null,
        };

        let update: Update<PostsStateInterface | null> = {
          id: myPosts![0].author.id as number,
          changes: updatedPosts,
        };

        console.log('CURRENT USER EFFECT', update);

        return PostActions.myPostsUpdatedSuccess({ posts: update });
      })
    );
  },
  { functional: true }
);

export const DeleteCommentEffect = createEffect(
  (actions$ = inject(Actions), postService = inject(PostService)) => {
    return actions$.pipe(
      ofType(CommentsActions.deleteComment),
      switchMap(({ comment }) => {
        return postService.delCommentAction(comment);
      }),
      map((_) => CommentsActions.deleteCommentSuccess())
    );
  },
  { functional: true }
);

export const UpdatePostsStoreAfterDeleteComment = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let myPosts: PostRes[];
    let myComment: CommentsRes;

    return actions$.pipe(
      ofType(CommentsActions.deleteComment),
      switchMap(({ comment, postAuthorId }) => {
        myComment = comment as CommentsRes;
        console.log('postAuthorId', postAuthorId);
        authorId = postAuthorId;
        return firstValueFrom(
          store.select(selectPostsEntities).pipe(
            map((v) => {
              console.log('Ent', v);
              return v[authorId!]!.posts as PostRes[];
            }),
            map((posts: PostRes[]) => {
              console.log('Ent posts', posts);
              myPosts = posts;
              return posts.filter((v) => v.id == comment!.postId)[0].comments;
            })
          )
        );
      }),
      map((comments) => {
        let post: PostRes = {
          ...myPosts!.filter((v) => v.id == myComment.postId)[0],
          comments: [...comments.filter((v) => v.id !== myComment.id)],
        };

        myPosts = myPosts.map((v) =>
          v.id === myComment.postId ? (v = post) : v
        );

        let updatedPosts: PostsStateInterface = {
          id: myPosts![0].author.id,
          isPostLoaded: true,
          posts: [...myPosts!],
          backendErrors: null,
        };

        let update: Update<PostsStateInterface | null> = {
          id: myPosts![0].author.id as number,
          changes: updatedPosts,
        };

        console.log('CURRENT USER EFFECT', update);

        return PostActions.myPostsUpdatedSuccess({ posts: update });
      })
    );
  },
  { functional: true }
);

export const UpdateCommentEffect = createEffect(
  (actions$ = inject(Actions), postService = inject(PostService)) => {
    let postId: number;

    return actions$.pipe(
      ofType(CommentsActions.updateComment),
      switchMap(({ comment, postAuthorId }) => {
        postId = comment!.postId;
        authorId = postAuthorId;
        console.log('МЫ В ЭФФЕКТАХ, postId ', postId);
        return postService.updateCommentAction(comment as CommentInt);
      }),
      map((comment) => {
        myComment = comment as CommentsRes;
        console.log('СМОТРИМ, ЧТО ВОЗВРАЩАЕТ МЕТОД UPDATE', comment);

        let updatedComment: Update<CommentsRes | null> = {
          id: postId,

          changes: comment,
        };
        console.log('## updatedComment', updatedComment);

        return CommentsActions.updateCommentSuccess({
          comment: updatedComment,
        });
      })
    );
  },
  { functional: true }
);

export const UpdatePostListAfterUpdateCommentEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    let myPosts: PostRes[];

    return actions$.pipe(
      ofType(CommentsActions.updateCommentSuccess),

      switchMap((comment) => {
        return firstValueFrom(
          store.select(selectPostsEntities).pipe(
            map((v) => {
              console.log('Ent до обновления', v);
              return v[authorId!]!.posts as PostRes[];
            }),
            map((posts: PostRes[]) => {
              console.log('Ent posts', posts);
              myPosts = posts;
              return posts.filter((v) => v.id == comment!.comment.id)[0]
                .comments;
            })
          )
        );
      }),
      map((comments) => {
        let comms: CommentsRes[] = [
          ...comments.map((v) => (v.id === myComment.id ? (v = myComment) : v)),
        ];

        console.log('ОБНОВЛЕННЫЙ СПИСОК КОММЕНТОВ', comms);
        console.log('ВОЗМОЖНАЯ ОШИБКА', myPosts);
        console.log('ВОЗМОЖНАЯ ОШИБКА, myComment', myComment.post_id);
        console.log(
          'ВОЗМОЖНАЯ ОШИБКА',
          myPosts!.filter((v) => v.id == myComment.post_id)[0]
        );

        let post: PostRes = {
          ...myPosts!.filter((v) => v.id == myComment.post_id)[0],
          comments: [...comms],
        };

        console.log('ОБНОВЛЕННЫЙ POST', post);

        myPosts = myPosts.map((v) =>
          v.id === myComment.post_id ? (v = post) : v
        );

        let updatedPosts: PostsStateInterface = {
          id: myPosts![0].author.id,
          isPostLoaded: true,
          posts: [...myPosts!],
          backendErrors: null,
        };

        let update: Update<PostsStateInterface | null> = {
          id: myPosts![0].author.id as number,
          changes: updatedPosts,
        };

        console.log('COMMENT EFFECT, updatePost', update);

        return PostActions.myPostsUpdatedSuccess({ posts: update });
      })
    );
  },
  { functional: true }
);
