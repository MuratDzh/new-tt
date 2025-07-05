import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SvgDirective } from '../../helpers/directives/svg.directive';
import { Profile } from '../../data/interfces/profile.interface';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
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

  constructor(private router: Router) {}

  toSettings() {
    this.router.navigateByUrl('settings');
  }
  toSendMessage(id: number) {
    this.router.navigate(['chats', id]);
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
