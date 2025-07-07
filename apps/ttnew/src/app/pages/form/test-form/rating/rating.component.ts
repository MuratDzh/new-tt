import {CommonModule} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Renderer2
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})
export class RatingComponent implements ControlValueAccessor {

  rating = ['😀', '🙂', '😐', '🙁', '😡'];
  value = ''

  onChange: (newValue: string) => void = () => { }
  onTouch: ()=>void=()=>{}

  renderer = inject(Renderer2)

  target!: HTMLBaseElement


  disabled = false

  cdr=inject(ChangeDetectorRef)

  @HostBinding('class')
    get onS() {
      return this.disabled? 'test1':''
    }

  @HostListener('click', ['$event'])
  onClick(e: Event) {
    console.log("EVENT", e);
    if (!this.disabled) {

    if ((e.target as HTMLBaseElement).nodeName === 'UL') return;

    if (this.target) {
      this.renderer.removeClass(this.target, 'active')
     }
    this.renderer.addClass(e.target, 'active');
     this.value = (e.target as HTMLBaseElement).innerHTML;

    // this.target = e.target as HTMLBaseElement;
    this.onChange(this.value)
    this.onTouch()
  }
  }

  @HostListener('blur')
  onBlur() {
    this.onTouch()
    }

  writeValue(obj: any): void {
    console.log("obj", obj);
    this.value = obj
    this.cdr.markForCheck()
  }
  registerOnChange(fn: any): void {
    this.onChange=fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch=fn
  }
  setDisabledState?(isDisabled: boolean): void {
    console.log('isDisabled', isDisabled);

    this.disabled = isDisabled
    this.cdr.markForCheck();
  }

}
