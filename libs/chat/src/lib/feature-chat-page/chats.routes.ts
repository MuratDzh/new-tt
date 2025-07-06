import { Routes } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';
import { ChatWorkspaceComponent } from './chat-workspace/chat-workspace.component';
import { ChatsResolver } from '../data/resolvers/chats.resolver';
import { inject } from '@angular/core';
import { ChatsService } from '../data/services';
import { ChatResolver } from '../data/resolvers/chat.resolver';
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
