import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChatsService } from '../../../data/services/chats.service';
import { Observable } from 'rxjs';
import { Chat } from '../../../data/interfces/chats.interface';
import { CommonModule } from '@angular/common';
import { ChatsBtnComponent } from './chats-btn/chats-btn.component';

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

  constructor(private chatsService: ChatsService) {}

  ngOnInit(): void {
    this.chatsService.getMyChats().subscribe();
    this.chats$ = this.chatsService.chats$;
  }
}
