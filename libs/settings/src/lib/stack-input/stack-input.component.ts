import {ChangeDetectionStrategy, Component, forwardRef, HostListener, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SvgDirective} from "@tt/common-ui";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-stack-input',
  standalone: true,
  imports: [CommonModule, SvgDirective, ReactiveFormsModule],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StackInputComponent),
      multi: true
    }
  ]
})
export class StackInputComponent implements ControlValueAccessor {

  isFirst = true;

  @Input()
  placeholder: string=''

  _value=new BehaviorSubject<string[]>(['1', '2','3', '4', '5']);
  value=this._value.asObservable()

  inputValue=new FormControl<string>('')

  onChange:(value:string[]) => void = ()=>{}
  onTouche:() => void = ()=>{}

  @HostListener('keydown.enter', ['$event'])
  onEnter():void{
    this._value.next([
      ...this._value.value,
      this.inputValue.value as string,
    ])
    this.inputValue.reset()
    this.onChange(this._value.value)
    this.onTouche()
  }

  writeValue(obj: any){
    this._value.next(obj)
  }
  registerOnChange(fn: any){
    this.onChange=fn
  }
  registerOnTouched(fn: any){
    this.onTouche=fn
  }
  setDisabledState?(isDisabled: boolean){
  }

  onDel(i:number, e: Event){
    if(this.isFirst) {
      this.isFirst = false;
      let value = [...this._value.value]
      value.splice(i, 1)
      this._value.next(value);
      setTimeout(()=>this.isFirst = true, 0);
      this.onChange(this._value.value)
      this.onTouche()
    }
  }

}
