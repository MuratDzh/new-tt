import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  AfterContentInit,
  contentChild,
} from '@angular/core';
import { CommentsRes, PostRes } from '../../data/interfaces/post.interface.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnChanges {
  text = '';

  constructor(private cdr: ChangeDetectorRef) {}

  @Input()
  post!: PostRes;

  @Input()
  updatedComText?: string;

  @Input()
  upComRes?: CommentsRes;

  @Input()
  me: number | null = null;

  @Output()
  delCom = new EventEmitter();

  @Output()
  updateCom = new EventEmitter();

  @Output()
  createCom = new EventEmitter();

  comment = contentChild(AvatarCircleComponent, {
    read: AvatarCircleComponent,
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (this.post.id == this.upComRes?.postId && this.upComRes.text) {
      this.text = this.upComRes.text;
    }

    if (
      changes['post']?.currentValue?.comments.length !==
      changes['post']?.previousValue?.comments.length
    ) {
      this.text = '';
    }

    this.cdr.markForCheck();
  }

  onDelCom() {
    this.delCom.emit();
    this.text = '';
  }

  onUpdateCom() {
    this.updateCom.emit();
  }

  toCreateCom() {
    this.createCom.emit(this.text);
    this.text = '';
  }
}
