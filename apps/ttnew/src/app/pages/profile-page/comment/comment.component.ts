import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CommentInt,
  CommentsRes,
} from '../../../data/interfces/post.interface.ts.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnChanges {
  text = '';

  @Input()
  updatedComText = '';

  @Input()
  comment!: CommentsRes;

  @Output()
  delCom = new EventEmitter();

  @Output()
  updateCom = new EventEmitter();

  @Output()
  createCom = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.updatedComText) {
      this.text = this.updatedComText;
    }
  }

  onDelCom() {
    this.delCom.emit();
  }

  onUpdateCom() {
    this.updateCom.emit();
  }

  toCreateCom() {
    console.log('toCreateCom()', this.updatedComText);

    if (this.updatedComText) {
      this.createCom.emit(this.text);
      this.text = '';
    } else {
      this.createCom.emit(this.text);
      this.text = '';
    }
  }
}
