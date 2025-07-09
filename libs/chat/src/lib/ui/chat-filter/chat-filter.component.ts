import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-filter.component.html',
  styleUrl: './chat-filter.component.scss',
})
export class ChatFilterComponent {
  // @Output()
  // value=new EventEmitter<string>()  
    
  search = new FormControl()
  
  // toSentValue() {
  //   console.log('this.search.value', this.search.value);
    
  //   this.value.emit(this.search.value)
  // }
}
