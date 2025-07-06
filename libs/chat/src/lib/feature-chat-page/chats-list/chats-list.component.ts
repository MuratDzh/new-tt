import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { map, Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ChatsBtnComponent } from '../../ui/chats-btn/chats-btn.component';
import { Chat } from 'libs/interfaces/src/lib/chat/chats.interface';
import { ChatsService } from './../../data/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, ChatsBtnComponent],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsListComponent implements OnInit {
  chats$!: Observable<Chat[] | null>;

  route = inject(ActivatedRoute);

  constructor(private chatsService: ChatsService) {}

  ngOnInit(): void {
    this.chatsService.getMyChats().pipe(
      // tap(chats => )
    ).subscribe();
    this.chats$ = this.chatsService.chats$;


    // this.chats$ = this.route.data.pipe(map((v) => v['chatList']));
  }
}
