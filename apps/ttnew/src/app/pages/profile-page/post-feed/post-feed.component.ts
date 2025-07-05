import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../../data/services/post.service';
import {
  filter,
  find,
  firstValueFrom,
  map,
  Observable,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { Profile } from '../../../data/interfces/profile.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CommentInt,
  CommentUpdate,
  Post,
  PostRes,
  CommentsRes,
} from '../../../data/interfces/post.interface.ts';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { ProfileService } from '../../../data/services/profile.service';
import { select, Store } from '@ngrx/store';
import { selectMe } from '../../../data/currentUserStore/current-user.reducer';
import { selectPostsFromUsersState } from '../postStore/post.reducer';
import { ActivatedRoute } from '@angular/router';
import { PostActions } from '../postStore/post.actions';
import { currentPostActions } from '../myPostStore/currentUserPost.actions';
import { selectCurrentPostEntities } from '../myPostStore/currentUserPosts.reducer';
import { Update } from '@ngrx/entity';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { CommentsActions } from '../commentsStore/comments.actions';

export interface PostFormValue {
  title: string;
  content: string;
}

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentComponent,
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent implements OnDestroy, OnChanges, OnInit {
  posts$!: Observable<PostRes[] | null | undefined>;

  posts!: PostRes[] | null;

  subsription$!: Subscription;

  test$!: Observable<any>;

  updatedPost: PostRes | null = null;

  updateSelectCount = 0;

  _profile!: Profile;
  me: number | null = null;

  updatedComText = '';
  updatedComment?: CommentsRes;
  updatedComId = 0;
  isUpCom = false;

  get profile(): Profile {
    return this._profile;
  }

  @Input()
  set profile(v: Profile) {
    this._profile = v;
    console.log('SET PROFILE', v);

    this.toLoadPost();
    this.cdr.markForCheck();
  }

  form = this.fb.group<PostFormValue>({
    title: '',
    content: '',
  });

  constructor(
    private postServ: PostService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges POST-FEED', changes);
  }

  ngOnInit(): void {
    this.store.select(selectMe).subscribe((v) => {
      return (this.me = v ? v.id : null);
    });

    this.store
      .select(selectPostsFromUsersState)
      .pipe(map((v) => v.entities[this.me!]?.posts as PostRes[]))
      .subscribe((v) => (this.posts = v));

    this.toLoadPost();
  }

  toLoadPost() {
    return (this.posts$ = this.store.select(selectPostsFromUsersState).pipe(
      map((v) => {
        let currentId: number | string = this.route.snapshot.params['id'];
        if (currentId === 'me') {
          return v.entities[this.profile.id]?.posts;
        }
        return v.entities[this.route.snapshot.params['id']]?.posts;
      }),
      tap(() => this.cdr.detectChanges())
    ));
  }

  toCreatePost(formValue: PostFormValue) {
    let authorId = this.profile.id;

    let post: Post = {
      ...formValue,
      authorId,
    };
    if (this.updatedPost) {
      console.log('UPDATED POST', post);

      this.store.dispatch(
        currentPostActions.updateMyPost({ post: post, id: this.updatedPost.id })
      );

      this.updatedPost = null;
    } else {
      // firstValueFrom(this.postServ.createPost(post));
      this.store.dispatch(currentPostActions.createPost({ post }));
    }
  }

  getPostFromChild(post: PostFormValue) {
    console.log(post);

    this.toCreatePost(post);
  }

  toUpdate(post: PostRes) {
    let update: Update<PostRes | null> = {
      id: post.id,
      changes: {
        ...post,
        isUpdate: false,
        id: post.id,
      },
    };

    this.store.dispatch(
      currentPostActions.updateMyPostsPropSuccess({ post: update })
    );

    this.store.dispatch(currentPostActions.getCurrentPost({ id: post.id }));

    let isUpdated: boolean | null | undefined;

    this.store.select(selectCurrentPostEntities).subscribe((v) => {
      console.log('POST to UPDATE', v);
      if (v[post.id]?.isUpdate !== undefined) {
        console.log('Ура!'), (isUpdated = v[post.id]!.isUpdate);
        return isUpdated;
      }
      console.log('--isUpdated--', isUpdated);
      return (isUpdated = null);
    });

    this.store.select(selectCurrentPostEntities).subscribe((v) => {
      this.updateSelectCount++;
      console.log('SELECT ВЫЗВАЛИ ', this.updateSelectCount, 'РАЗ');
      console.log('IS I=UPDATED?', isUpdated);
      this.updatedPost = isUpdated ? null : (v[post.id] as PostRes);
      console.log('<<<<>>>>', this.updatedPost);
      this.cdr.detectChanges();
    });
  }

  toDel(post: PostRes) {
    // this.postServ.getPostById(post.id);
    // this.postServ.delPost(post).subscribe();
    console.log('УДАЛЕНИЕ, post.id', post.id);

    this.store.dispatch(currentPostActions.delPost({ post }));
  }

  onDelCom(comment: CommentsRes, postAuthorId: number) {
    this.store.dispatch(
      CommentsActions.deleteComment({ comment, postAuthorId })
    );
  }

  // onDelCom(i: number, postId: number) {
  //   this.postServ.delComment(i, postId, this.profile.id).subscribe();
  // }

  onUpdateCom(comment: CommentsRes, postId: number) {
    console.log('111', comment);
    (this.updatedComText = comment.text),
      (this.updatedComId = comment.id),
      (this.updatedComment = comment);
    this.isUpCom = true;
    // this.cdr.markForCheck();
  }

  //   onUpdateCom(i: number, postId: number) {
  //   this.postServ.getComment(i, postId).subscribe((v) =>
  //     setTimeout(() => {
  //       console.log('111', v);
  //       (this.updatedComText = v.text),
  //         (this.updatedComId = v.id),
  //         (this.updatedComment = v);
  //       this.isUpCom = true;
  //       this.cdr.markForCheck();
  //     }, 0)
  //   );
  // }

  createCom(text: string, post: PostRes) {
    if (this.isUpCom) {
      let v = {
        text,
        commentId: this.updatedComId,
        authorId: post.author.id,
        postId: post.id,
      };
      // firstValueFrom(this.postServ.updateComment(v));
      console.log('UPDATE COMMENT', v);
      console.log('postAuthorId', post.author.id);
      this.store.dispatch(
        CommentsActions.updateComment({
          comment: v,
          postAuthorId: post.author.id,
        })
      );
      this.isUpCom = false;
      this.updatedComment = undefined;
    } else {
      let comment: CommentInt = {
        text,
        commentId: this.updatedComId,
        authorId: post.author.id,
        postId: post.id,
      };
      // firstValueFrom(this.postServ.createComment(v));
      console.log('МЕТОД КРИЕЙТ, post', post.author.id);
      this.store.dispatch(
        CommentsActions.createComment({ comment, postAuthorId: post.author.id })
      );
    }
  }

  onGetCom(comment: CommentsRes) {
    console.log('COMMENT', comment);
    // this.postServ.getCommentById(comment.id).subscribe(
    //   v=>console.log("getCommentById",v)
    // )
    this.store.dispatch(CommentsActions.getCommentById({ comment }));
  }

  ngOnDestroy(): void {
    this.subsription$?.unsubscribe();
  }
}
