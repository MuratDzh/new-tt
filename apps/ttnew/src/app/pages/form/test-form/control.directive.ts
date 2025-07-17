import { ChangeDetectorRef, Directive, ElementRef, forwardRef, HostListener, inject, OnInit, Optional, Renderer2, Sanitizer, SecurityContext } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlComponent } from './control/control.component';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ControlDirective),
      multi: true,
    },
  ],
})
export class ControlDirective implements ControlValueAccessor {
  com = inject(ControlComponent, { optional: true });
  renderer = inject(Renderer2);
  sanitaizer = inject(DomSanitizer);
  cdr=inject(ChangeDetectorRef)
  el = inject(ElementRef);
  // text = this.com?.text.value;
  title = this.el.nativeElement;
  // p = this.renderer.createElement('p');
  // description=this.el.nativeElement.children[1]

  onChange1: (newValue: string) => void = (newValue) => console.log(newValue);
  onTouch1: ()=>void =()=>{}

  @HostListener('input', ['$event'])
  onClick1(e: Event) {
    // console.log('EVENT',e);

    this.onChange1((e.target as HTMLElement).innerHTML);
  }

  @HostListener('blur')
  onBlur1() {
    this.onTouch1()
    }

  writeValue(obj: any): void {
    // this.renderer.appendChild(this.title, this.p);
    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.sanitaizer.sanitize(SecurityContext.HTML, obj)
    );
  }

  registerOnChange(fn: any): void {
    this.onChange1 = fn;

    this.cdr.markForCheck()
  }
  registerOnTouched(fn: any): void {
    this.onTouch1=fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, "contentEditable", !isDisabled)
  }
}
