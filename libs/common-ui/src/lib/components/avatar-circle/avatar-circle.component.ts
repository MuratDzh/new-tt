import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPipe } from '../../pipes';

@Component({
  selector: 'app-avatar-circle',
  standalone: true,
  imports: [CommonModule, ImgPipe],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
})
export class AvatarCircleComponent {

  @Input()
  profileAvatar!:string|null|undefined
}
