import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Chat } from '../../../../data/interfces/chats.interface';
import { ImgPipe } from '../../../../helpers/pipes/img.pipe';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
