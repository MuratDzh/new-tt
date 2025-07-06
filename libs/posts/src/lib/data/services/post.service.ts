import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CommentInt,
  CommentsRes,
  CommentsResFull,
  CommentUpdate,
  Post,
  PostRes,
} from '../interfaces/post.interface.ts.js';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  url = 'https://icherniakov.ru/yt-course/';

  _posts$ = new BehaviorSubject<PostRes[]>([]);
  posts$ = this._posts$.asObservable();

  constructor(private http: HttpClient) {}

  createPost(post: Post) {
    return this.http
      .post<PostRes>(`${this.url}post/`, post)
      .pipe(tap((v) => console.log('CREATE POST SERVICE', v)));
  }
  // createPost(post: Post) {
  //   return this.http.post<PostRes>(`${this.url}post/`, post).pipe(
  //     switchMap(({ author }) => {
  //       return this.getPosts(author.id);
  //     })
  //   );
  // }

  getPosts(id: number | string) {
    return this.http
      .get<PostRes[]>(`${this.url}post/`, { params: { user_id: id } })
      .pipe(
        tap((v) => console.log('GET POSTS', 'ID: ', id, 'POSTS: ', v)),
        tap((v) => this._posts$.next(v))
      );
  }

  getPostById(postId: number) {
    return this.http.get<PostRes>(`${this.url}post/${postId}`);
  }

  updatePost(post: Post, postId: number) {
    return this.http.patch<PostRes>(`${this.url}post/${postId}`, {
      title: post.title,
      content: post.content,
    });
  }

  // updatePost(post: Post, postId: number) {
  //   return this.http
  //     .patch(`${this.url}post/${postId}`, {
  //       title: post.title,
  //       content: post.content,
  //     })
  //     .pipe(
  //       switchMap(() => {
  //         return this.getPosts(post.authorId);
  //       })
  //     );
  // }

  delPost(post: PostRes) {
    return this.http.delete<PostRes>(`${this.url}post/${post.id}`);
  }
  // delPost(post: PostRes) {
  //   return this.http.delete<PostRes>(`${this.url}post/${post.id}`).pipe(
  //     switchMap(() => {
  //       return this.getPosts(post.author.id);
  //     })
  //   );
  // }

  createComment(e: CommentInt) {
    return this.http
      .post<CommentsRes>(`${this.url}comment/`, {
        text: e.text,
        authorId: e.authorId,
        postId: e.postId,
        commentId: 0,
      })
      .pipe(
        tap((v) => console.log('COM', v)),
        switchMap(() => {
          return this.getPosts(e.authorId);
        })
      );
  }

  createCommentAction(e: CommentInt) {
    return this.http.post<CommentsRes>(`${this.url}comment/`, {
      text: e.text,
      authorId: e.authorId,
      postId: e.postId,
      commentId: 0,
    });
  }

  delComment(i: number, postId: number, authorId: number) {
    return this.getPostById(postId).pipe(
      map((v) => {
        return v.comments[i];
      }),
      switchMap((comment) => {
        return this.http.delete(`${this.url}comment/${comment.id}`).pipe(
          tap((v) => console.log('DEL com', v)),
          switchMap(() => {
            return this.getPosts(authorId);
          })
        );
      })
    );
  }

  delCommentAction(comment: CommentsRes) {
    return this.http.delete(`${this.url}comment/${comment.id}`);
  }

  getCommentById(id: number | string) {
    return this.http.get(`${this.url}comment/${id}`);
  }

  getComment(i: number, postId: number) {
    return this.getPostById(postId).pipe(
      map((v) => {
        return v.comments[i];
      })
    );
  }

  updateCommentAction(e: Partial<CommentInt>) {
    return this.http.patch(`${this.url}comment/${e.commentId}`, {
      text: e.text,
    });
  }

  // updateComment(e: Partial<CommentInt>) {
  //   return this.http
  //     .patch(`${this.url}comment/${e.commentId}`, {
  //       text: e.text,
  //     })
  //     .pipe(
  //       switchMap(() => {
  //         return this.getPosts(e.authorId as number);
  //       })
  //     );
  // }
}
