import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DadataAddressComponent } from './dadata-address/dadata-address.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom, tap } from 'rxjs';
import { Address, Feature, MockService } from '../../../services/mock.service';


function datePickerValidate():ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log('CONTROL',control.value.start);
    let startDate = + new Date(control.value.start).getTime();
    let endDate = + new Date(control.value.end);
    console.log('endDate - startDate', endDate - startDate);

    endDate - startDate > 0
      ? null
      : control.get('end')!.setErrors({
          datePickerValidate: 'Неверная дата окончания',
        });
    
    return endDate - startDate > 0
      ? null
      : {
          datePickerValidate: 'Неверная дата окончания',
        };
  }
}

function phoneNumberLengthValidate():ValidatorFn {
  return (control: AbstractControl<string>) => {
    if (control.value.startsWith('8')) {
      return control.value.length == 15 ? null : { phoneNumberLengthValidate: 'Введите корректный номер' };
    }
    if (control.value.startsWith('+7')) {
      return control.value.length == 16 ? null : { phoneNumberLengthValidate: 'Введите корректный номер' };
    }

    return null
    
  }
}


@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RatingComponent,
    DadataAddressComponent,
  ],
  templateUrl: './test-form.component.html',
  styleUrl: './test-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestFormComponent implements OnInit {
  years: number[] = [];
  features!: Feature[];

  form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    birthday: new FormControl('', Validators.required),
    // address: new FormGroup({
    //   city: new FormControl(''),
    //   street: new FormControl(''),
    // }),
    dadataAddresses: new FormArray([
      this.getDadadaAddress(),
      this.getDadadaAddress(),
    ]),

    // dadataAddress: this.getDadadaAddress(),
    phones: new FormArray([
      new FormGroup({
        label: new FormControl('work', { nonNullable: true }),
        phone: new FormControl('+7', phoneNumberLengthValidate()),
      }),
    ]),
    work: new FormGroup(
      {
        start: new FormControl(),
        end: new FormControl(),
        jobCompany: new FormControl(null, Validators.required),
      },
      datePickerValidate()
    ),
    features: new FormRecord({}),
    textarea: new FormControl(''),
    rating: new FormControl('😀'),
  });

  mockService = inject(MockService);
  constructor(private cdr: ChangeDetectorRef) {
    this.form.controls.phones.valueChanges
      .pipe(
        tap((v) => {
          if (this.form.controls.phones) {
            for (
              let i = 0;
              i < this.form.controls.phones.controls.length;
              i++
            ) {
              if (
                (this.form.controls.phones.controls[i].controls.phone.value &&
                  this.form.controls.phones.controls[i].controls.phone.value!
                    .length > 1 &&
                  Number.isNaN(
                    Number(
                      this.form.controls.phones.controls[
                        i
                      ].controls.phone.value!.at(-1)
                    )
                  ) == true) ||
                (this.form.controls.phones.controls[i].controls.phone.value
                  ?.length &&
                  this.form.controls.phones.controls[i].controls.phone
                    .value![0] !== '+' &&
                  this.form.controls.phones.controls[i].controls.phone
                    .value![0] !== '8')
              ) {
                console.log(
                  this.form.controls.phones.controls[
                    i
                  ].controls.phone.value!.at(-1)
                );
                console.log(
                  this.form.controls.phones.controls[
                    i
                  ].controls.phone.value!.slice(
                    0,
                    this.form.controls.phones.controls[i].controls.phone.value!
                      .length - 1
                  )
                );

                this.form.controls.phones.controls[i].controls.phone.setValue(
                  this.form.controls.phones.controls[
                    i
                  ].controls.phone.value!.slice(
                    0,
                    this.form.controls.phones.controls[i].controls.phone.value!
                      .length - 1
                  )
                );
              }

              // console.log(
              //   Number(
              //     this.form.controls.phones.controls[i].controls.phone.value!.at(
              //       -1
              //     )
              //   )
              // );

              if (
                this.form.controls.phones.controls[i].controls.phone.value
                  ?.length &&
                this.form.controls.phones.controls[
                  i
                ].controls.phone.value!.startsWith('+7')
              ) {
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 3
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 2)
                      .concat('(')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(2, 3)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 7
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 6)
                      .concat(')')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(6, 7)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 11
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 10)
                      .concat('-')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(10, 11)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 14
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 13)
                      .concat('-')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(13, 14)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 17
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[
                      i
                    ].controls.phone.value!.slice(0, 16)
                  );
                }
              }
              if (
                this.form.controls.phones.controls[i].controls.phone.value
                  ?.length &&
                this.form.controls.phones.controls[
                  i
                ].controls.phone.value!.startsWith('8')
              ) {
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 2
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 1)
                      .concat('(')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(1, 2)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 6
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 5)
                      .concat(')')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(5, 6)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 10
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 9)
                      .concat('-')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(9, 10)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 13
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[i].controls.phone
                      .value!.slice(0, 12)
                      .concat('-')
                      .concat(
                        (
                          this.form.controls.phones.controls[i].controls.phone
                            .value as string
                        ).slice(12, 13)
                      )
                  );
                }
                if (
                  this.form.controls.phones.controls[i].controls.phone.value
                    ?.length == 16
                ) {
                  this.form.controls.phones.controls[i].controls.phone.setValue(
                    this.form.controls.phones.controls[
                      i
                    ].controls.phone.value!.slice(0, 15)
                  );
                }
              }
            }
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngOnInit(): void {
    let date = new Date().getFullYear();

    for (let i = 0; i < 100; i++) {
      this.years.push(date - i);
    }

    firstValueFrom(
      this.mockService.getFeatures().pipe(
        tap((features) => {
          this.features = features;
          for (let feature of features) {
            this.form.controls.features.setControl(
              feature.code,
              new FormControl(feature.value)
            );
          }
        })
      )
    );
    firstValueFrom(
      this.mockService.getAddresses().pipe(
        tap((addresses) => {
          this.form.controls.dadataAddresses.clear();
          for (let address of addresses) {
            this.form.controls.dadataAddresses.controls.push(
              this.getDadadaAddress(address)
            );
          }
        })
      )
    );
  }

  addPhone() {
    this.form.controls.phones.insert(
      0,
      new FormGroup({
        label: new FormControl('home', { nonNullable: true }),
        phone: new FormControl('+7', phoneNumberLengthValidate()),
      })
    );
  }

  delPhone(i: number) {
    this.form.controls.phones.removeAt(i);
  }

  getDadadaAddress(address: Address = {}): FormGroup {
    return new FormGroup({
      city: new FormControl(address.city ? address.city : 'Чистополь', [
        Validators.required,
      ]),
      street: new FormControl(address.street ? address.street : '', [
        Validators.required,
      ]),
      building: new FormControl(address.building ? address.building : '', [
        Validators.required,
      ]),
      apartment: new FormControl(address.apartment ? address.apartment : ''),
    });
  }

  toAddDadataAddress() {
    this.form.controls.dadataAddresses.insert(0, this.getDadadaAddress());
  }

  toDelDadataAddress(i: number) {
    this.form.controls.dadataAddresses.removeAt(i);
  }

  sort() {
    return 0;
  }

  onSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      console.log('Все ОК');
    }
  }
}
