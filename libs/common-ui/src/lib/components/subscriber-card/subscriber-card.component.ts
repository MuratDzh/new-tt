import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ImgPipe } from '../../pipes/img.pipe';
import { CommonModule } from '@angular/common';
import { Profile } from '@tt/interfaces/profile';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [ImgPipe, CommonModule],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriberCardComponent {
  @Input()
  subscriber?: Profile;
}
