import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgPipe } from 'libs/common-ui/src/lib/pipes/img.pipe';
import { Chat } from 'libs/interfaces/src/lib/chat/chats.interface';

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
