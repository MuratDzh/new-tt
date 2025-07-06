import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Chat } from "@tt/interfaces/chat";
import { Observable } from "rxjs";
import { ChatsService } from "../services";
import { inject } from '@angular/core';

export const ChatsResolver: ResolveFn<Observable<Chat[]|void>> = (
  route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatService = inject(ChatsService)

  return chatService.getMyChats()
};
