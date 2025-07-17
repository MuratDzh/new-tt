import { AfterContentInit, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
})
export class WrapperComponent implements AfterContentInit {
  el = inject(ElementRef);
  renderer = inject(Renderer2);
  windowInnerHeight = document.documentElement.clientHeight;

  ngAfterContentInit(): void {
    // console.log('Wrapper EL', this.el);
    // console.log('Wrapper EL{}', this.el.nativeElement.getBoundingClientRect());
    this.renderer.setStyle(
      this.el.nativeElement,
      'max-height',
      `${this.windowInnerHeight - this.el.nativeElement.offsetTop - 26 }px`
    );
  }

}
