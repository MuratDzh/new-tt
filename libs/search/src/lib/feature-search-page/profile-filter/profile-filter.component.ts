import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SvgDirective } from '@tt/common-ui';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, Observable, Subscription, switchMap } from 'rxjs';
import { Subscribers } from '@tt/interfaces/subscribers';

import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { Profile } from '@tt/interfaces/profile';
import {
  selectFilteredAccounts,
  selectSearchFormValue,
  FilterAccountsActions,
  selectAccounts,
} from '@tt/shared';

import { SearchForm } from '@tt/interfaces/search-form';



@Component({
  selector: 'app-profile-filter',
  standalone: true,
  imports: [SvgDirective, ReactiveFormsModule, CommonModule],
  templateUrl: './profile-filter.component.html',
  styleUrl: './profile-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFilterComponent implements OnInit, OnDestroy {
  accounts$!: Observable<Profile[] | null>;
  searchFormValue!: Partial<SearchForm> | null;

  ac!: Subscribers<Profile>;
  subscription!: Subscription;

  fb = inject(FormBuilder);

  constructor(private store: Store) {}

  form = this.fb.group<SearchForm>({
    firstName: '',
    lastName: '',
    city: '',
    stack: '',
  });

  ngOnInit() {
    this.store
      .select(selectSearchFormValue)
      .subscribe((v) => (this.searchFormValue = v));
    if (this.searchFormValue) {
      this.form.patchValue(this.searchFormValue);
    }

    this.subscription = this.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((v) =>{
        if (v.city==''&&v.firstName==''&&v.lastName==''&&v.stack=='') {
          return
        }
         return this.store.dispatch(
          FilterAccountsActions.filterAccounts({ searchFormValue: v })
        )}
      );
    this.accounts$ = this.form.valueChanges.pipe(
      switchMap((v) => {
        if (v.city==''&&v.firstName==''&&v.lastName==''&&v.stack=='') {
          return this.store.select(selectAccounts).pipe(
            map((v) => {
              return v ? v.items : null;
            }))
        }
        return this.store.select(selectFilteredAccounts).pipe(
          map((v) => {
            return v ? v.items : null;
          })
        );
      })
    );
  }
  toSearch() {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
