import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  CommentInt,
  CommentsRes,
  CommentUpdate,
  PostRes,
} from '../../../data/interfces/post.interface.ts.js';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component.js';
import { FormsModule } from '@angular/forms';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.post.id == this.upComRes?.postId && this.upComRes.text) {
      this.text = this.upComRes.text;
    }
    this.cdr.markForCheck();
  }

  onDelCom() {
    this.delCom.emit();
  }

  onUpdateCom() {
    this.updateCom.emit();
    this.text = '';
  }

  toCreateCom() {
    this.createCom.emit(this.text);
    this.text = '';
  }
}
