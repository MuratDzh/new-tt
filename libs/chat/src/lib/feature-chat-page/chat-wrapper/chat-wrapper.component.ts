import { ChangeDetectionStrategy, Component } from '@angular/core';



@Component({
  selector: 'app-chat-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './chat-wrapper.component.html',
  styleUrl: './chat-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWrapperComponent {
  
  constructor() {
  
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
