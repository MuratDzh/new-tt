import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgPipe } from '@tt/common-ui';
import { Chat } from '@tt/interfaces/chat';

@Component({
  selector: 'app-chats-btn',
  standalone: true,
  imports: [ImgPipe, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsBtnComponent {
  @Input()
  chat!: Chat;
}
