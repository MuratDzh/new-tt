import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { PostComponent } from '../post/post.component';

import { map, Observable, Subscription, tap } from 'rxjs';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule, DatePipe } from '@angular/common';

import { Store } from '@ngrx/store';

import { ActivatedRoute } from '@angular/router';

import { Update } from '@ngrx/entity';

import { CommentInt, CommentsRes, Post, PostRes } from '../../data';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { CommentComponent } from '../../ui/comment/comment.component';
import {
  CommentsActions,
  currentPostActions,
  selectCurrentPostEntities,
  selectPostsFromUsersState,
} from '../../data/store';

import { selectMe } from '@tt/shared';
import { Profile } from '@tt/interfaces/profile';
import { AvatarCircleComponent, SvgDirective } from '@tt/common-ui';
import { CommentInputComponent } from '../../ui/comment-input/comment-input.component';

import { HiddenButtonsComponent } from '../../ui/hidden-buttons/hidden-buttons.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface PostFormValue {
  title: string;
  content: string;
}

let test = false;

function ResizeDecorator(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (e: Event) {
    // return fromEvent(window, 'resize')
    //   .pipe(debounceTime(300),
    //     startWith(e))
    //   .subscribe((v) => {
    //     console.log('ResizeDecorator')
    //     return originalMethod.call(this, v)
    //   });
    if (!test) {
      test = true;
      setTimeout(() => {
        console.log(test);

        originalMethod.call(this);
        test = false;
      }, 1000);
    }
  };
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
    AvatarCircleComponent,
    CommentInputComponent,
    SvgDirective,
    HiddenButtonsComponent,
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class PostFeedComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  posts$!: Observable<PostRes[] | null | undefined>;

  posts!: PostRes[] | null;



  updatedPost: PostRes | null = null;

  updateSelectCount = 0;

  _profile!: Profile;
  myId: number | null = null;
  myProfile: Profile | null = null;

  updatedComText = '';
  updatedComment?: CommentsRes;
  updatedComId = 0;
  isUpCom = false;

  isButtonsHidded = true;

  el = inject(ElementRef);
  renderer = inject(Renderer2);
  destroyRef=inject(DestroyRef)

  get profile(): Profile {
    return this._profile;
  }

  @Input()
  set profile(v: Profile) {
    this._profile = v;;

    this.toLoadPost();
    this.cdr.markForCheck();
  }

  @ViewChild('wrapper', { read: ElementRef })
  wrapperDiv!: ElementRef<HTMLDivElement>;

  @ViewChildren(HiddenButtonsComponent)
  hiddenButtons!: QueryList<HiddenButtonsComponent>;

  @ResizeDecorator
  @HostListener('window:resize', ['$event'])
  onWinResize(e: Event) {

    this.getHeight();
  }

  form = this.fb.group<PostFormValue>({
    title: '',
    content: '',
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.select(selectMe).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((v) => {
      this.myProfile = v;
      return (this.myId = v ? v.id : null);
    });

    this.store
      .select(selectPostsFromUsersState)
      .pipe(map((v) => v.entities[this.myId!]?.posts as PostRes[]),
      takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.getHeight();
        return (this.posts = v);
      });

    this.toLoadPost();
  }

  ngAfterViewInit(): void {
    this.getHeight();
  }

  ngAfterViewChecked(): void {
    this.getHeight();
  }

  // @ResizeDecorator
  getHeight() {
    const { top } = (
      this.wrapperDiv.nativeElement as HTMLDivElement
    )?.getBoundingClientRect() as DOMRect;

    const height1 = document.documentElement.clientHeight - top - 24 - 1;

    this.renderer.addClass(this.wrapperDiv.nativeElement, 'test');
    this.renderer.setStyle(
      this.wrapperDiv.nativeElement,
      'max-height',
      `${height1}px`
    );
  }

  //~~~~~ Это старый вариант функции, который дает сбой. Использовал ее только для того, чтобы
  //  по условию находить нужный дочерний эллемент ~~~~~~

  // getHeight() {
  //   console.log(' getHeight()');

  //   const { top } =
  //     this.profile.id == this.myId
  //       ? (
  //           this.el.nativeElement.children[1] as HTMLDivElement
  //         )?.getBoundingClientRect()
  //       : (this.el.nativeElement as HTMLDivElement)?.getBoundingClientRect();

  //   const height1 = document.documentElement.clientHeight - top - 24 - 1;
  //   if (this.profile.id == this.myId) {
  //     this.renderer.setStyle(
  //       this.el.nativeElement.children[1] as HTMLDivElement,
  //       'max-height',
  //       `${height1}px`
  //     );
  //     return;
  //   }
  //   this.renderer.addClass(this.el.nativeElement, 'test');
  //   this.renderer.setStyle(this.el.nativeElement, 'max-height', `${height1}px`);

  //   console.log('---TOP---', top);

  //   // console.log('window.innerHeight', window.innerHeight);
  //   console.log('clientHeight', document.documentElement.clientHeight);
  // }

  toLoadPost() {
    return (this.posts$ = this.store.select(selectPostsFromUsersState).pipe(
      map((v) => {
        const currentId: number | string = this.route.snapshot.params['id'];
        if (currentId === 'me') {
          return v.entities[this.profile.id]?.posts;
        }
        return v.entities[this.route.snapshot.params['id']]?.posts;
      }),
      tap(() => this.cdr.detectChanges())
    ));
  }

  toCreatePost(formValue: PostFormValue) {
    const authorId = this.profile.id;

    const post: Post = {
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
    const update: Update<PostRes | null> = {
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

    this.store
      .select(selectCurrentPostEntities)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        console.log('POST to UPDATE', v);
        if (v[post.id]?.isUpdate !== undefined) {
          isUpdated = v[post.id]!.isUpdate;
          return isUpdated;
        }
        console.log('--isUpdated--', isUpdated);
        return (isUpdated = null);
      });

    this.store
      .select(selectCurrentPostEntities)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.updateSelectCount++;
        this.updatedPost = isUpdated ? null : (v[post.id] as PostRes);
        
        this.cdr.detectChanges();
      });
  }

  toDel(post: PostRes) {
   

    this.store.dispatch(currentPostActions.delPost({ post }));
  }

  onDelCom(comment: CommentsRes, postAuthorId: number, e: Event) {
    this.store.dispatch(
      CommentsActions.deleteComment({ comment, postAuthorId })
    );
    this.hiddenButtons.filter((v) => v.commentId === comment.id)[0].hideClass();
    this.hiddenButtons.filter((v) => v.commentId === comment.id)[0].isHidden =
      true;
    this.isButtonsHidded = true;
  }

  onUpdateCom(comment: CommentsRes, postId: number, e: Event) {
    (this.updatedComText = comment.text),
      (this.updatedComId = comment.id),
      (this.updatedComment = comment);
    this.isUpCom = true;
    // this.cdr.markForCheck();
  }

  createCom(text: string, post: PostRes) {
    if (this.isUpCom) {
      const v = {
        text,
        commentId: this.updatedComId,
        authorId: post.author.id,
        postId: post.id,
      };
      // firstValueFrom(this.postServ.updateComment(v));
     
      this.store.dispatch(
        CommentsActions.updateComment({
          comment: v,
          postAuthorId: post.author.id,
        })
      );
      this.isUpCom = false;
      this.updatedComment = undefined;
    } else {
      const comment: CommentInt = {
        text,
        commentId: this.updatedComId,
        authorId: post.author.id,
        postId: post.id,
      };
      // firstValueFrom(this.postServ.createComment(v));
      this.store.dispatch(
        CommentsActions.createComment({ comment, postAuthorId: post.author.id })
      );
    }
  }

  onGetCom(comment: CommentsRes) {
    // this.postServ.getCommentById(comment.id).subscribe(
    //   v=>console.log("getCommentById",v)
    // )
    this.store.dispatch(CommentsActions.getCommentById({ comment }));
  }

  showButtons(commentId: number, e: Event) {

    e.stopPropagation();
    this.hiddenButtons
      .filter((v) => v.commentId === commentId)[0]
      .showButtons();

    this.hiddenButtons
      .filter((v) => v.commentId !== commentId)
      .forEach((v) => {
        v.isHidden = true;
        v.hideClass();
      });

    this.hiddenButtons.filter((v) => v.commentId === commentId)[0].isHidden =
      false;
  }

}
