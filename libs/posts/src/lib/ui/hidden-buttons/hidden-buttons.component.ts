import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hidden-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hidden-buttons.component.html',
  styleUrl: './hidden-buttons.component.scss',
})
export class HiddenButtonsComponent {
  isHidden = true;

  @Input()
    commentId!:number

  @HostBinding('class')
  hiddenClass = 'hidden';

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    console.log('SSSS, event, targer', event, event.target);
    // this.isHidden=false
    if (((event as PointerEvent).target as HTMLBaseElement).classList[2] === "update") return

    if (((event as PointerEvent).target as HTMLBaseElement).classList[0]=="update-img") return
      event.stopPropagation();
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event) {
    if (!this.isHidden) {
      console.log('!this.isHidden', !this.isHidden);
      
      this.hideClass()
      this.isHidden = true;
      console.log('ZZZ?? event, ', event);
    }
  }

  showButtons() {
    console.log("NNN");
    
    if (this.isHidden) {
      console.log("PPPPp");
      
      this.hiddenClass = '';
      this.isHidden=false
      // this.isHidden=!this.isHidden
    }
  }

  hideClass() {
    this.hiddenClass = 'hidden';
  }
}
