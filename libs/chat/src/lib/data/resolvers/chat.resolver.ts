import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Chat, ChatRes } from "@tt/interfaces/chat";
import { Observable} from 'rxjs';
import { ChatsService } from "@tt/data-access";
import { inject } from '@angular/core';

export const ChatResolver: ResolveFn<Observable<ChatRes>|void> = (
  route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatService = inject(ChatsService)
    console.log('SOS');

    const chatList:Chat[] = route.parent?.data['chatList'];
    
    console.log('chatList', chatList);
    
    console.log('(+(route.paramMap.get() as string)', (+(route.paramMap.get('id') as string)))
    console.log('Child', state);


    return chatList!.find(
      (v) => v.id == +(route.paramMap.get('id') as string)
    )
      ? chatService.getChatById(+(route.paramMap.get('id') as string))
      : chatService.postChat(500);
//   return chatService.postChat(+(route.parent!.paramMap.get('id') as string))
}