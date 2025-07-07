import { Component, OnInit } from '@angular/core';
import { ControlDirective } from '../control.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onInput() {
    console.log(this.text.value);
    
  }

  text = new FormControl('HGGHH');
}
