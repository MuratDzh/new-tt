<<<<<<<< HEAD:apps/ttnew/src/app/pages/login/login.component.ts
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
========
import { ChangeDetectionStrategy, Component } from '@angular/core';
>>>>>>>> 1.1-branch:libs/login/src/lib/feature-login-page/login.component.ts
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';
import { loginActions } from '../data/login-store/login.actions';
import { selectLoginBackendErrors } from '../data/login-store/login.reducer';
import { CommonModule } from '@angular/common';
import {  Observable } from 'rxjs';
import { FormLoginValue } from '@tt/tt-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  passwordVisible = false;
  // type=signal('password')

  form = new FormGroup({
    username: new FormControl<string>('MuratDzh', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl<string>('fl6BGnq2av', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });
<<<<<<<< HEAD:apps/ttnew/src/app/pages/login/login.component.ts
  private store=inject(Store);
  backendErr$ = this.store.select(selectBackendErrors);

  
========

  backendErr$: Observable<any>;
  constructor(
    // private auth: AuthService,
    private store: Store
  ) {
    this.backendErr$ = this.store.select(selectLoginBackendErrors);
  }
>>>>>>>> 1.1-branch:libs/login/src/lib/feature-login-page/login.component.ts

  onSubmit() {
    if (this.form.valid) {
  
      this.store.dispatch(
        loginActions.login({ request: this.form.value as FormLoginValue })
      );
    }
  }

}
