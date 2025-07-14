import { ChangeDetectionStrategy, Component } from '@angular/core';
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

  backendErr$: Observable<any>;
  constructor(
    // private auth: AuthService,
    private store: Store
  ) {
    this.backendErr$ = this.store.select(selectLoginBackendErrors);
  }

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      // this.auth.login(this.form.value).subscribe();
      this.store.dispatch(
        loginActions.login({ request: this.form.value as FormLoginValue })
      );
    }
  }

  // onVisible() {
  //   console.log(this.type());

  //   this.passwordVisible?this.type.set('password'):this.type.set('text')
  //   this.passwordVisible=!this.passwordVisible
  // }
}
