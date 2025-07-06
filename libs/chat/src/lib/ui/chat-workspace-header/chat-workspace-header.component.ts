import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-workspace-header',
  standalone: true,
  imports: [],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceHeaderComponent {}
