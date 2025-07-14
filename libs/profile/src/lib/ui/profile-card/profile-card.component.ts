import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Profile } from '@tt/interfaces/profile';
import { CommonModule } from '@angular/common';
import {
  ImgPipe,
  SvgDirective,
} from '@tt/common-ui';

import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, ImgPipe, SvgDirective],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent implements OnChanges {
  @Input()
  profile!: Profile;

  @Output()
  toSubscribe = new EventEmitter();

  @Output()
  toSendMessage = new EventEmitter();

  @Output()
  toUnsubscribe = new EventEmitter();

  router = inject(Router)
  cdr=inject(ChangeDetectorRef)
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes){}
      console.log('OnChanges', changes);
      
  }

  onSubscribe(e: Event) {
    
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
