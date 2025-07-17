import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostRes } from '../../data';
import { PostFormValue } from '../../feature-posts-wall/post-feed/post-feed.component';
import { SvgDirective, TextareaDirective } from '@tt/common-ui';


export function createValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const t = new RegExp(control.value)
   
    console.log('++++++', /[A-Za-z0-9_]/.test(control.value));
    
    return /[A-Za-z0-9_]/.test(control.value) ? null: { err: true };
  };
}

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SvgDirective, TextareaDirective],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostInputComponent implements OnChanges {
  @Input()
  updatedPost!: PostRes | null;

  @Output()
  post = new EventEmitter<PostFormValue>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, createValidator()]],
    content: ['', [Validators.required, createValidator()]],
  });

  isFullView = false;

  @HostListener('click', ['$event'])
  onHostClick(e: PointerEvent) {
    if (((e as PointerEvent).target as HTMLButtonElement).classList[2] == 'busket') return;
    if (((e as PointerEvent).target as HTMLButtonElement).classList[0] == 'busket-img') return;
    

    if (((e as PointerEvent).target as HTMLButtonElement).classList[3] == 'create-post') return;
    if (((e as PointerEvent).target as HTMLButtonElement).classList[0] == 'create-post') return;
    

    this.isFullView = true;
    e.stopPropagation();
  }

  @HostListener('window:click')
  onWindowClick() {
    if (this.form.controls.content.invalid && this.isFullView) {
      this.isFullView = false;

    }
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // setTimeout(() => {
    //   this.form.patchValue(this.updatedPost as PostRes);

    //   this.cdr.markForCheck();
    // }, 0);
    this.form.patchValue(this.updatedPost as PostRes);
    if(changes['updatedPost']?.currentValue) this.isFullView = true;
    
    console.log('changes', changes['updatedPost'], changes);
    this.cdr.detectChanges();
  }

  createPost() {
    this.post.emit(this.form.value as PostFormValue);
    this.form.reset();
    this.isFullView = false;
  }

  exit(e: Event) {
    this.form.reset();
    this.isFullView = true;
  }

  onTextareaInput(e: Event) {

    //-----Висит директива и вся логика работает в ней----

    // const textarea = e.target as HTMLBaseElement;
    // console.log(textarea.scrollHeight);
    // // this.renderer.setStyle(textarea, 'height', 'auto');
    // this.renderer.setStyle(textarea, 'height', '44px');
    // this.renderer.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
    
  }
}
