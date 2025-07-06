import { Profile } from "../profile";


export interface ChatRes {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?:Profile
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt?: string;
  user?: Profile|null;
  isMyMessage?: boolean;
}

export interface Chat {
  id: number;
  userFrom: Profile;
  message: string;
  createdAt: string;
  unreadMessages: number;
}
