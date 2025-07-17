import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChildInputComponent} from "../../child-input/child-input.component";
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {debounceTime, Subscription, switchMap, tap} from "rxjs";
import {DadataService} from "../../../../services/dadata/dadata.service";
import {DadataSuggestions} from "../../../../services/dadata/dadata.interface";



@Component({
  selector: 'app-dadata-address',
  standalone: true,
  imports: [CommonModule, ChildInputComponent, ReactiveFormsModule],
  templateUrl: './dadata-address.component.html',
  styleUrl: './dadata-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DadataAddressComponent),
    },
  ],
})
export class DadataAddressComponent implements ControlValueAccessor, OnInit {
  dadataService = inject(DadataService);
  suggestions$!: Subscription;
  suggestions: any = {};

  onChange(v: any){}

  isDropdownOpen = signal<boolean>(false);
  search = new FormControl('');

  sugs$ = this.search.valueChanges.pipe(
    debounceTime(500),
    switchMap((v) => {
      return this.dadataService.getSuggestions(v);
    }),
    tap((v) => this.isDropdownOpen.set(!!v.length))
  );

  el = inject(ElementRef);

  @HostListener('window:click', ['$event'])
  onWinClick(e: Event) {
    if (e.target !== this.el.nativeElement.children[1]) {
      this.isDropdownOpen.set(false);
    }
  }

  dadataAddress = this.getAddress();

  ngOnInit() {
    this.dadataAddress.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    });
  }

  getAddress() {
    return new FormGroup({
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.required]),
      apartment: new FormControl(''),
    });
  }

  writeValue(obj: any) {
    if (typeof obj.city !== 'string') {
      obj = {
        city: obj.city.value,
        street: obj.street.value,
        building: obj.building.value,
        apartment: obj.apartment.value,
      };
    }
    this.dadataAddress.setValue(obj);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean) {}

  onTouched() {}

  onSuggestionsPicker(val: DadataSuggestions) {
    this.search.setValue(val.value);

    this.dadataAddress.patchValue(
      {
        city: val.data.city || val.data.settlement,
        street: val.data.street,
        building: val.data.house,
        apartment: val.data.flat || '',
      },
      { emitEvent: false }
    );
    this.onChange(this.dadataAddress.value);
    this.onTouched();
    this.isDropdownOpen.set(false);
  }
}
