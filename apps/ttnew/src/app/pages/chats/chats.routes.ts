import { Routes } from '@angular/router';
import { ChatsComponent } from './chats.component';
import { ChatWorkspaceComponent } from './chat-workspace/chat-workspace.component';
export const ChatsRoutes: Routes = [
  {
    path: '',
    component: ChatsComponent,
    children: [
      {
        path: ':id',
        component: ChatWorkspaceComponent,
      },
    ],
  },
];
