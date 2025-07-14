import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatsService, isErrorMessage } from '../../data';
import { Subscription, tap, timer, firstValueFrom } from 'rxjs';
import { AuthService } from '@tt/tt-auth';



@Component({
  selector: 'app-chat-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './chat-wrapper.component.html',
  styleUrl: './chat-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWrapperComponent {
  chatService = inject(ChatsService);
  authService = inject(AuthService);
  connect!: Subscription;
  constructor() {
    // this.connectWS();

    // setTimeout(() => console.log('setTimeout(()'));

    // setTimeout(() => {
    //   console.log('Закрыто');
    //   this.chatService.wsClose();
    // }, 100000);
    // setTimeout(() => {
    //   this.connectWS();
    // }, 5300 * 60);
  }
  connectWS() {
    this.connect = this.chatService
      .wsConnect()
      .pipe(
        tap((v) => console.log('wsConnect', v)),
        // takeUntilDestroyed()
      )
      .subscribe((message) => {
        if (isErrorMessage(message)) {
          console.log('isErrorMessage(message)');
          
          this.reconnect()
        }
      });
  }
        


  async reconnect() {
    this.chatService.wsClose();
    this.connect.unsubscribe();
    await firstValueFrom(this.authService.refreshToken())
    await  firstValueFrom(timer(2000))
          
    
    await this.chatService.wsConnect().subscribe()
   
  }
        
      
  }

// connectWS() {
//   this.connect = this.chatService
//     .wsConnect()
//     .pipe(
//       tap((v) => console.log('wsConnect', v)),
//       map((message) => {
//         if (isErrorMessage(message)) {
//           console.log('isErrorMessage(message)');
//           this.chatService.wsClose();
//           this.connect.unsubscribe();
//           this.authService.refreshToken().pipe(
//             switchMap(() =>
//               timer(200).pipe(
//                 take(2),
//                 tap(() => console.log('TAP')),
//                 switchMap(() => {
//                   console.log('switchMap(()');
//                   return this.chatService.wsConnect();
//                 })
//               )
//             )
//           );
//         }
//       }),

//       takeUntilDestroyed()
//     )
//     .subscribe();
// }
