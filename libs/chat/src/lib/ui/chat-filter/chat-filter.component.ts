import { Component} from '@angular/core';
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
  
  search = new FormControl()
  
}
