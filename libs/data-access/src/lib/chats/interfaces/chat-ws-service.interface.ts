import {Observable} from "rxjs";
import {ChatWSMessageType} from "./chat-ws-message.interface";

export interface ChatConnectionWSParams{
    url: string
    token: string
    handleMessage:(message:any)=>void
}

export interface ChatWSServiceInterface{
    connect: (params:ChatConnectionWSParams) => void | Observable<ChatWSMessageType>
    sendMessage: (message: string, chatId: number) => void
    disconnect: ()=>void
}

