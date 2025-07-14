import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@tt/sidebar';
import { ChatsService, isUnreadMessage } from '@tt/chat';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { filter, tap } from "rxjs";



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {

  chatService=inject(ChatsService)

  // unredMessagesCount: number = 0;
  unredMessagesCount = signal<number>(0);

  constructor() {
    this.chatService.wsConnect().pipe(
      filter(v=>!!v),
      tap(v=>{
        isUnreadMessage(v)? this.unredMessagesCount.set(v.data.count) : null
        console.log('TAP Count',this.unredMessagesCount())
      }),
      takeUntilDestroyed())
    .subscribe()

  }

  ngOnInit(): void {
    // this.chatService.wsConnect()
   
  }

}
