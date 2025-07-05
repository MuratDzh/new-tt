import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ChatsService } from '../../../data/services/chats.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap, firstValueFrom } from 'rxjs';
import {
  Chat,
  ChatRes,
  Message,
} from '../../../data/interfces/chats.interface';
import { CommonModule } from '@angular/common';
import { ChatWorkspaceHeaderComponent } from './chat-wrapper/chat-workspace-header/chat-workspace-header.component';
import { ChatWrapperComponent } from './chat-wrapper/chat-wrapper.component';
import { ChatMessagesComponent } from './chat-wrapper/chat-messages/chat-messages.component';
import { MessageInputComponent } from '../../../common-ui/message-input/message-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ImgPipe } from '../../../helpers/pipes/img.pipe';
import { SubscriberCardComponent } from '../../../common-ui/subscriber-card/subscriber-card.component';

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
    ImgPipe,
    SubscriberCardComponent,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceComponent implements OnInit {
  messages$!: Observable<Message[] | null>;
  chat!: ChatRes;
  chatId!: number;
  userId!: number;

  constructor(
    private chatService: ChatsService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  message = new FormControl('');

  ngOnInit(): void {
    this.router.params
      .pipe(
        tap(({ id }) => (this.userId = id)),
        switchMap(({ id }) => {
          return this.chatService.getChatById(id).pipe(
            tap((v) => {
              console.log(v), (this.chat = v), (this.chatId = v.id);
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
  }

  onSendMessage() {
    this.chatService
      .postMessage(this.chatId, this.message.value as string, this.userId)
      .subscribe();
  }
}
