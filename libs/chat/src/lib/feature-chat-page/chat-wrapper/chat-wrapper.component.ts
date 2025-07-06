import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './chat-wrapper.component.html',
  styleUrl: './chat-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWrapperComponent {}
