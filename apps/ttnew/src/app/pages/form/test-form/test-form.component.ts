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

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RatingComponent],
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
    address: new FormGroup({
      city: new FormControl(''),
      street: new FormControl(''),
    }),
    dadataAddresses: new FormArray([
      new FormControl()
    ]),
    phones: new FormArray([
      new FormGroup({
        label: new FormControl('work', { nonNullable: true }),
        phone: new FormControl<number>(8),
      }),
    ]),
    textarea: new FormControl(''),
    rating: new FormControl('😀'),
  });

  constructor(private cdr: ChangeDetectorRef) {}

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
        phone: new FormControl(8),
      })
    );
  }

  getDadadaAddress() {
    return
  }

  delPhone(i: number) {
    this.form.controls.phones.removeAt(i);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
