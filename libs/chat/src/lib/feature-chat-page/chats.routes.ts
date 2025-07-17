import { Routes } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';
import { ChatWorkspaceComponent } from './chat-workspace/chat-workspace.component';

export const ChatsRoutes: Routes = [
  {
    path: '',
    component: ChatsComponent,
    resolve: [
      // { chatList: ChatsResolver }
    ],
    children: [
      {
        path: ':id',
        component: ChatWorkspaceComponent,
        resolve: {
          // chat: ChatResolver
        }
      },
    ],
  },
];
