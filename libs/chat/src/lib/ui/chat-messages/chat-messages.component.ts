import {
   AfterViewChecked, 
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesComponent implements   AfterViewChecked{
  el=inject(ElementRef)
  renderer=inject(Renderer2)
  

  ngAfterViewInit() {
    const height = document.documentElement.clientHeight;
    const heightEl = this.el.nativeElement.clientHeight;
    const heightElScroll = this.el.nativeElement.scrollHeight;
    const heightCurrentScroll = this.el.nativeElement.scrollY;
    const heightElObj = this.el.nativeElement.getBoundingClientRect().height;
    // console.log("heightDocument", height,"heightEl: ", heightEl,"heightElObj:", heightElObj, 'scrollHeight: ', heightElScroll)
    // console.log("scroll: ", heightCurrentScroll)

    // setInterval(()=>console.log("heightView", height, heightEl, heightElObj), 2000)
  }

  ngAfterViewChecked() {
    const height = document.documentElement.clientHeight;
    const heightEl = this.el.nativeElement.clientHeight;
    const heightElScroll = this.el.nativeElement.scrollHeight;
    const heightCurrentScroll = this.el.nativeElement.getBoundingClientRect();
    const heightElObj = this.el.nativeElement.getBoundingClientRect().height;
    // console.log("heightDocument", height,"heightEl: ", heightEl,"heightElObj:", heightElObj, 'scrollHeight: ', heightElScroll)
    // console.log("scroll: ", heightCurrentScroll)
    setTimeout(()=>document.documentElement.scrollTo(0, 400), 500)
    this.renderer.setProperty(this.el, 'scroll', 'top:100')
    document.documentElement.scrollTo(0, 400)
    // setInterval(()=>console.log("scroll: ", heightCurrentScroll), 2000)
  }
}
