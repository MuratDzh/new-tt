export interface ChatWSMessageBaseInterface {
  status: 'success' | 'error';
}

export interface ChatWSUnreadMessageInterface
  extends ChatWSMessageBaseInterface {
  action: 'unread';
  data: {
    count: number;
  };
}

export interface ChatWSNewMessageInterface extends ChatWSMessageBaseInterface {
  action: 'message';
  data: {
    id: number;
    message: string;
    chat_id: number;
    created_at: string;
    author: number;
  };
}

export interface ChatWSErrorInterface extends ChatWSMessageBaseInterface {
  status: "error";
  message: string;
}

export interface ChatWSSendMessage {
  text: string;
  chat_id: number;
}

export type ChatWSMessageType=ChatWSErrorInterface|ChatWSUnreadMessageInterface|ChatWSNewMessageInterface|ChatWSSendMessage




