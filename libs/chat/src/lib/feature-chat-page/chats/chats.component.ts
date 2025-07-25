import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { ChatFilterComponent } from '../../ui/chat-filter/chat-filter.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [ChatsListComponent, RouterOutlet, ChatFilterComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsComponent { }
 
