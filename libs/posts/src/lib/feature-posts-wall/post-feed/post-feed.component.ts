import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  viewChildren,
} from '@angular/core';

import { PostComponent } from '../post/post.component';

import {
  auditTime,
  debounce,
  debounceTime,
  delay,
  exhaustMap,
  filter,
  find,
  firstValueFrom,
  fromEvent,
  map,
  Observable,
  of,
  skip,
  startWith,
  Subscription,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule, DatePipe } from '@angular/common';

import { select, Store } from '@ngrx/store';

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

import { selectMe } from 'libs/shared/src/lib/data/store/currentUserStore/current-user.reducer';
import { Profile } from 'libs/interfaces/src/lib/profile/profile.interface';
import { AvatarCircleComponent } from '../../../../../common-ui/src/lib/components/avatar-circle/avatar-circle.component';
import { CommentInputComponent } from '../../ui/comment-input/comment-input.component';
import { SvgDirective } from '../../../../../common-ui/src/lib/directives/svg.directive';

import { HiddenButtonsComponent } from '../../ui/hidden-buttons/hidden-buttons.component';


export interface PostFormValue {
  title: string;
  content: string;
}

  let test = false

  function ResizeDecorator(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
  
    let originalMethod = descriptor.value;
    descriptor.value = function (e:Event) {
      
      // return fromEvent(window, 'resize')
      //   .pipe(debounceTime(300),
      //     startWith(e))
      //   .subscribe((v) => {
      //     console.log('ResizeDecorator')
      //     return originalMethod.call(this, v)
      //   });
      if (!test) {
        test=true
        setTimeout(() => {
          console.log(test);
          
          originalMethod.call(this)
          test=false
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
  implements OnDestroy,  OnInit, AfterViewInit, AfterViewChecked
{
  posts$!: Observable<PostRes[] | null | undefined>;

  posts!: PostRes[] | null;

  subsription$!: Subscription;

  test$!: Observable<any>;

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

  @ViewChild('wrapper', { read: ElementRef })
    wrapperDiv!: ElementRef<HTMLDivElement>

  @ViewChildren(HiddenButtonsComponent)
  hiddenButtons!: QueryList<HiddenButtonsComponent>;

  @ResizeDecorator
  @HostListener('window:resize', ['$event'])
  onWinResize(e: Event) {
    console.log('@HostListener');

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
    this.store.select(selectMe).subscribe((v) => {
      this.myProfile = v;
      return (this.myId = v ? v.id : null);
    });

    this.store
      .select(selectPostsFromUsersState)
      .pipe(map((v) => v.entities[this.myId!]?.posts as PostRes[]))
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
    
    const { top } = (this.wrapperDiv.nativeElement as HTMLDivElement)?.getBoundingClientRect();

    const height1 = document.documentElement.clientHeight - top - 24 - 1;
    
    this.renderer.addClass(this.wrapperDiv.nativeElement, 'test');
    this.renderer.setStyle(this.wrapperDiv.nativeElement, 'max-height', `${height1}px`);

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

  onDelCom(comment: CommentsRes, postAuthorId: number, e: Event) {
    this.store.dispatch(
      CommentsActions.deleteComment({ comment, postAuthorId })
    );
    this.hiddenButtons.filter((v) => v.commentId === comment.id)[0].hideClass();
    this.hiddenButtons.filter((v) => v.commentId === comment.id)[0].isHidden =
      true;
    this.isButtonsHidded = true;
  }

  // onDelCom(i: number, postId: number) {
  //   this.postServ.delComment(i, postId, this.profile.id).subscribe();
  // }

  onUpdateCom(comment: CommentsRes, postId: number, e: Event) {
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

  showButtons(commentId: number, e: Event) {
    console.log('Event', e);

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

  ngOnDestroy(): void {
    this.subsription$?.unsubscribe();
  }
}
