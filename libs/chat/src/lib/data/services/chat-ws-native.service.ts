import { ChatConnectionWSParams, ChatWSServiceInterface } from "@tt/interfaces/chat";

export class ChatWsNativeService implements ChatWSServiceInterface {

  #ws:WebSocket|null=null

  connect(params:ChatConnectionWSParams) {
    if (this.#ws) return

    this.#ws = new WebSocket(params.url, [params.token])
    this.#ws.onmessage = (event: MessageEvent) => {
      params.handleMessage(
        JSON.parse(event.data)
      )
    }
    this.#ws.onclose = () => console.log('WebSocket Closed')
  }

  sendMessage(message: string, chatId: number){
    this.#ws?.send(
      JSON.stringify({
        text: message,
        chat_id: chatId,
      })
    );
  }

  disconnect(){
      this.#ws?.close()
    }



}
