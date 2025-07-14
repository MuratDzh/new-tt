import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  HostListener,
  OnInit, QueryList, ViewChildren,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap,} from 'rxjs';

import { CommonModule, DatePipe } from '@angular/common';
import { ChatWorkspaceHeaderComponent } from '../../ui/chat-workspace-header/chat-workspace-header.component';
import { ChatWrapperComponent } from '../chat-wrapper/chat-wrapper.component';
import { ChatMessagesComponent } from '../../ui/chat-messages/chat-messages.component';


import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ChatRes, Message } from '@tt/interfaces/chat';
import { ChatsService } from './../../data/services';

import { Store } from '@ngrx/store';

import {
  MessageGroupDateDirective,
  MessagrGroupDatePipe,
  selectMe,
} from '@tt/shared';
import {
  MessageInputComponent,
  SvgDirective, TextareaDirective,
  AvatarCircleComponent,
  SubscriberCardComponent,
} from '@tt/common-ui';
import {Profile} from "@tt/profile";
import { inject } from '@angular/core';




let test = false
let secondTest = false

function ResizeDecorator(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {

  let originalMethod = descriptor.value;
  descriptor.value = function (e: Event) {

    if (!test) {

        originalMethod.call(this, e);

    }
  }
}

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    CommonModule,
    ChatWorkspaceHeaderComponent,
    ChatWrapperComponent,
    ChatMessagesComponent,
    MessageInputComponent,
    ReactiveFormsModule,
    AvatarCircleComponent,
    SvgDirective,
   SubscriberCardComponent,
    TextareaDirective,
    MessageGroupDateDirective,
    MessagrGroupDatePipe,
    MessagrGroupDatePipe,
    MessageGroupDateDirective,
    TextareaDirective,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[DatePipe]
})
export class ChatWorkspaceComponent implements OnInit, AfterViewChecked {
  messages$!: Observable<Message[] | null>;
  chat!: ChatRes;
  chatId!: number;
  userId!: number;
  myAvatar!: string | null;
  companion!: Profile;
  myId!:number


  @ViewChildren("messageText")
  messageText!: QueryList<ElementRef<HTMLDivElement>>;

   store=inject(Store)


  constructor(
    private chatService: ChatsService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  message = new FormControl('', {validators: Validators.required , nonNullable: true })

  @ResizeDecorator
  @HostListener('window:click', ['$event'])
  onWinClick(e: Event) {

    if (!(e.target as HTMLBaseElement).classList.contains('textarea')) {

        this.message.setValue(this.message.value.replace(/\n/g, '').trim());
       test=true
    }
  }

  ngAfterViewChecked() {

    this.messageText?.last?.nativeElement.scrollIntoView()
  }

  ngOnInit(): void {
    this.router.params
      .pipe(
        tap(({ id }) => (this.userId = id)),
        switchMap(({ id }) => {
          return this.chatService.getChatById(id).pipe(
            tap((v) => {
              console.log(v),
                (this.chat = v),
                (this.companion = v.companion as Profile),
                (this.chatId = v.id);
            })
          );
        })
      )
      .pipe(
        tap(() => {
          (this.messages$ = this.chatService.messages$),
            this.cdr.markForCheck();
        })
      )
      .subscribe();

    this.store
      .select(selectMe)
      .subscribe((v) => (this.myAvatar = v!.avatarUrl, this.myId = v!.id));

  }

  onSendMessage() {
    console.log('onSendMessage()', this.message.value);
    
    if (this.message.valid) {
      // this.chatService
      //   .postMessage(this.chatId, this.message.value as string, this.userId)
      //   .subscribe();
      this.chatService.wsAdapter.sendMessage(this.message.value, this.chatId)
      this.message.reset();
     // this.cdr.detectChanges()
    }
  }



  onInput() {
    console.log('1');
    if (!secondTest) {
      secondTest = true,
      (test = false)
      setTimeout(() => {

        console.log('2'),
        secondTest=false
      }, 1000);
    }

  }
}
