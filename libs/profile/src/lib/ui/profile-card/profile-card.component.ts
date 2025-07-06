import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { CommonModule } from '@angular/common';
import { ImgPipe } from '../../../../../common-ui/src/lib/pipes/img.pipe';
import { SvgDirective } from '../../../../../common-ui/src/lib/directives/svg.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, ImgPipe, SvgDirective],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  @Input()
  profile!: Profile;

  @Output()
  toSubscribe = new EventEmitter();

  @Output()
  toSendMessage = new EventEmitter();

  @Output()
  toUnsubscribe = new EventEmitter();

  router=inject(Router)

  onSubscribe() {
    this.toSubscribe.emit();
  }

  onSendMessage() {
    this.toSendMessage.emit();
  }

  onUnsubscribe() {
    this.toUnsubscribe.emit();
  }

  toProfile() {
    this.router.navigateByUrl(`profile/${this.profile.id}`)
  }
}
