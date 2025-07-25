import { ChatsService } from './chats.service';
import { ChatWsNativeService } from './chat-ws-native.service';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import {
  isUnreadMessage,
  isNewMessage,
  isErrorMessageFunc,
} from './../interfaces/type-guard';

export {
  ChatsService,
  ChatWsNativeService,
  ChatWsRxjsService,
  isUnreadMessage,
  isNewMessage,
  isErrorMessageFunc,
};
