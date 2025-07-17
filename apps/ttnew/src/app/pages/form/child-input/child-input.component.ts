import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-child-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-input.component.html',
  styleUrl: './child-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChildInputComponent),
    multi: true
    }
  ]
})
export class ChildInputComponent implements ControlValueAccessor {

  cdr=inject(ChangeDetectorRef)

  @Input()
  type: "text"|"password" ="text"

  workPlace=new FormControl('')

  onValueChange:(v:string|null)=>void = ()=>{}
  onTouched:()=>void = ()=>{}

  writeValue(obj: any){
    this.workPlace.setValue(obj)
  }
  registerOnChange(fn: any) {
    this.onValueChange=fn
  }
  registerOnTouched(fn: any){
    this.onTouched=fn
  }
  setDisabledState?(isDisabled: boolean){

  }


  onInputValue(){
    this.onValueChange(this.workPlace.value)
    this.onTouched()
    this.cdr.markForCheck()
  }
}
