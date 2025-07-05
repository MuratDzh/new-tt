import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatsListComponent } from './chats-list/chats-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [ChatsListComponent, RouterOutlet],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsComponent {}
