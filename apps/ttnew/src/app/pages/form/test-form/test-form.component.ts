import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating/rating.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DadataAddressComponent } from './dadata-address/dadata-address.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

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

  form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    birthday: new FormControl('2000', { nonNullable: true }),
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
        phone: new FormControl('+7'),
      }),
    ]),
    textarea: new FormControl(''),
    rating: new FormControl('😀'),
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.form.controls.phones.valueChanges.pipe(
      tap(v => {
        if (this.form.controls.phones) {
          for (let i = 0; i < this.form.controls.phones.controls.length; i++) {
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
                  .value![0] !== '8')) {
              console.log(
                this.form.controls.phones.controls[i].controls.phone.value!.at(
                  -1
                )
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
              this.form.controls.phones.controls[i].controls.phone.value!.startsWith('+7')
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
              this.form.controls.phones.controls[i].controls.phone.value!.startsWith('8')
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
                  this.form.controls.phones.controls[i].controls.phone
                    .value!.slice(0, 15)
                    
                );
              }
            
          }
          }
        }
      }
      ),
      takeUntilDestroyed()
    ).subscribe()
  }

  ngOnInit(): void {
    let date = new Date().getFullYear();

    for (let i = 0; i < 100; i++) {
      this.years.push(date - i);
    }
  }

  addPhone() {
    this.form.controls.phones.insert(
      0,
      new FormGroup({
        label: new FormControl('home', { nonNullable: true }),
        phone: new FormControl('+7'),
      })
    );
  }

  delPhone(i: number) {
    this.form.controls.phones.removeAt(i);
  }

  getDadadaAddress(): FormGroup {
    return new FormGroup({
      city: new FormControl('Чистополь', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.required]),
      apartment: new FormControl(''),
    });
  }

  toAddDadataAddress() {
    this.form.controls.dadataAddresses.insert(0, this.getDadadaAddress())
  }

  toDelDadataAddress(i: number) {
    this.form.controls.dadataAddresses.removeAt(i)
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
