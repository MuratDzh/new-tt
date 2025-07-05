import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SvgDirective } from '../../../helpers/directives/svg.directive';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  map,
  Observable,
  of,
  skip,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { Subscribers } from '../../../data/interfces/subscribers.interfase';
import { Profile } from '../../../data/interfces/profile.interface';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FilterAccountsActions } from './FilterAccountsStore/filter-accounts.actions';
import {
  selectFilteredAccounts,
  selectSearchFormValue,
} from './FilterAccountsStore/filter-accounts.reducer';
import { selectAccounts } from '../AccountsStore/accounts.reducer';

export interface SearchForm {
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  stack: string | null;
}

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

  constructor(private store: Store, private fb: FormBuilder) {}

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
      .subscribe((v) =>
        this.store.dispatch(
          FilterAccountsActions.filterAccounts({ searchFormValue: v })
        )
      );
    this.accounts$ = this.form.valueChanges.pipe(
      switchMap(() => {
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
