import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appTextarea]',
  standalone: true,
})
export class TextareaDirective {
  @HostBinding('style.height')
  get height(): string | undefined {
    console.log('T', this.host.nativeElement.scrollHeight);

    if (this.host.nativeElement.scrollHeight < 61) {
     

      return '44px';
      // this.render.setStyle(this.host.nativeElement, 'height', '44px');
    }
    return `${this.host.nativeElement.scrollHeight}px`;
  }

  @HostListener('input', ['$event'])
  onInput(e: InputEvent) {
    // if (this.host.nativeElement.scrollHeight < 65) {
    //   console.log('true');

    //   this.render.setStyle(this.host.nativeElement, 'height', '44px');
    // } else {

    this.render.setStyle(this.host.nativeElement, 'height', `auto`);

    this.render.setStyle(
      this.host.nativeElement,
      'height',
      `${this.host.nativeElement.scrollHeight}px`
    );
  }

  constructor(public host: ElementRef, private render: Renderer2) {
   
  }
}
