import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: '[appSvgDir]',
  standalone: true,
})
export class SvgDirective implements OnInit {
  @Input()
  appSvgDir!: string;

  // @HostListener('mouseover')
  // onMouseOver() {
  //   this.color='blue'
  // }

  //Выяснить, почему при создании дочернего тэга use и добавлении href svg не отображается,
  // а при содании в шаблоне пустого тэга use все работает корректно

  constructor(private templ: ElementRef, private render: Renderer2) {}

  ngOnInit(): void {
    // console.log(this.templ);
    // const use1 = this.render.createElement('use');
    // this.render.appendChild(this.templ.nativeElement, use1);
    // this.render.setAttribute(
    //   use1,
    //   'href',
    //   './../../../assets/svg/home.svg#home'
    // );
    this.render.setAttribute(
      this.templ.nativeElement['children'][0],
      'href',
      `./../../../assets/svg/${this.appSvgDir}.svg#${this.appSvgDir}`
    );
  }
}
