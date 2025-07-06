import { ChatWSMessageType } from './chat-ws-message.interface';
import {
  ChatWSErrorInterface, ChatWSNewMessageInterface,
  ChatWSSendMessage,
  ChatWSUnreadMessageInterface
} from './chat-ws-message.interface';


export function isUnreadMessage(message: ChatWSMessageType): message is ChatWSUnreadMessageInterface {
  return "action" in message&&message.action === 'unread'
}

export function isNewMessage(message: ChatWSMessageType): message is ChatWSNewMessageInterface {
  return 'action' in message && message.action === 'message';
}

export function isErrorMessage(message: ChatWSMessageType): message is ChatWSErrorInterface {
  return "message" in message
}

