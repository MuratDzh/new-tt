import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgDirective } from '@tt/common-ui';
import { Profile } from '@tt/interfaces/profile';
import { ImgPipe } from '@tt/common-ui';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [SvgDirective, ImgPipe, CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  @Input()
  profile$?: Observable<Profile | null | undefined>;

  @Output()
  unsubscribe = new EventEmitter();

  @Output()
  subscribe = new EventEmitter();

  @Output()
    createChat=new EventEmitter<number>()

  constructor(private router: Router) {}

  toSettings() {
    this.router.navigateByUrl('settings');
  }
  toSendMessage(id: number) {
    // this.router.navigate(['newchats', id]);
    this.createChat.emit(id)
  }

  toUnsubscribe() {
    console.log('ОТПИСКА');
    this.unsubscribe.emit();
  }

  toSubscribe() {
    console.log('ПОДПИСКА');
    this.subscribe.emit();
  }
}
