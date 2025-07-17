
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
  Input,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appTextarea]',
  standalone: true,
})
export class TextareaDirective implements AfterViewInit {
  @Input()
  appTextarea?:string

  @HostBinding('style.height')
  get height(): string | undefined {
   

    if (this.host.nativeElement.scrollHeight < 61) {
      
      return '44px';
    }

    return `${this.host.nativeElement.scrollHeight}px`;
    // }
  }

  @HostListener('input', ['$event'])
  onInput(e: InputEvent) {
    
    // if (this.host.nativeElement.scrollHeight < 65) {
    //   console.log('true');

    //   this.render.setStyle(this.host.nativeElement, 'height', '44px');
    // } else {

    // this.render.setStyle(this.host.nativeElement, 'height', `auto`);
    this.getHight();
  }

  @HostListener('window:click')
  onWinClick() {
    this.getHight()
    }

  // @HostListener('blur')
  // onBlur() {
  //   console.log('onBlur()');
  //   console.log(this.appTextarea?.replace(/\n/g, '').trim());
  

  //   if (this.appTextarea?.replace(/\n/g, '').trim() === '') {
  //    this.render.setProperty(
  //      this.host.nativeElement,
  //      'innerText',
  //      `${this.appTextarea?.replace(/\n/g, '').trim()}`
  //    );
  //     this.render.setStyle(this.host.nativeElement, 'height', '44px');
  //   }
  //   // this.host.nativeElement.innerText;
  //   this.getHight();
  // }

  constructor(public host: ElementRef, private render: Renderer2) {
  
  }

  ngAfterViewInit(): void {
      this.getHight()
  }

  getHight() {
    this.render.setStyle(this.host.nativeElement, 'height', '44px');
   
    this.render.setStyle(
      this.host.nativeElement,
      'height',
      `${this.host.nativeElement.scrollHeight}px`
    );
  }
}
