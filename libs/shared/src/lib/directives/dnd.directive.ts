import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[dnd]',
  standalone: true,
})
export class DndDirective {
  @Output()
  avatar = new EventEmitter<File>();

  @HostBinding('style.borderColor')
  borderColor = 'var(--light-color)';

  @HostListener('dragover', ['$event'])
  onMouseover(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.borderColor = 'var(--primary-color-hover)';
  }

  @HostListener('dragleave', ['$event'])
  onMouseleave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.borderColor = 'var(--light-color)';
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.borderColor = 'var(--primary-color-hover)';
    console.log('drop', e.dataTransfer?.files[0]);
    this.avatar.emit(e.dataTransfer?.files[0]);
  }
}
