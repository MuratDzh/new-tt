import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../data/interfces/profile.interface';
import { CommonModule } from '@angular/common';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
import { SvgDirective } from '../../helpers/directives/svg.directive';

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

  onSubscribe() {
    this.toSubscribe.emit();
  }

  onSendMessage() {
    this.toSendMessage.emit();
  }

  onUnsubscribe() {
    this.toUnsubscribe.emit();
  }
}
