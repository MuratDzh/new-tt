import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Profile } from '../../data/interfces/profile.interface';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
import { CommonModule } from '@angular/common';

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
