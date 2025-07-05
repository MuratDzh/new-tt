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
import { PostFormValue } from '../post-feed/post-feed.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostRes } from '../../../data/interfces/post.interface.ts';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostInputComponent implements OnChanges {
  @Input()
  updatedPost!: PostRes | null;

  @Output()
  post = new EventEmitter<PostFormValue>();

  form = this.fb.group<PostFormValue>({
    title: '',
    content: '',
  });

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // setTimeout(() => {
    //   this.form.patchValue(this.updatedPost as PostRes);

    //   this.cdr.markForCheck();
    // }, 0);
    this.form.patchValue(this.updatedPost as PostRes);
    this.cdr.detectChanges();
    console.log('changes', changes);
  }

  createPost() {
    this.post.emit(this.form.value as PostFormValue);
    this.form.reset();
  }
}
