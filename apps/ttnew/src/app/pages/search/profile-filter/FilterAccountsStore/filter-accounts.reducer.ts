import { createFeature, createReducer, on } from '@ngrx/store';
import { FilterAccountsActions } from './filter-accounts.actions';
import { AccountsStateInterface } from '../../AccountsStore/accounts-state.interface';
import { FilterAccountsInterface } from './filter-accounts.state.interface';

const AccountsInitialState: FilterAccountsInterface = {
  isAccountsLoaded: false,
  accounts: null,
  backandErrors: null,
  searchFormValue: null,
};

const FilterAccountsFeature = createFeature({
  name: 'FilterAccounts',
  reducer: createReducer(
    AccountsInitialState,
    on(FilterAccountsActions.filterAccounts, (state, action) => ({
      ...state,
      searchFormValue: action.searchFormValue,
    })),
    on(FilterAccountsActions.filterAccountsSuccess, (state, action) => ({
      ...state,
      accounts: action.accounts,
      isAccountsLoaded: true,
    })),
    on(FilterAccountsActions.filterAccountsFailure, (state, action) => ({
      ...state,
      isAccountsLoaded: false,
      accounts: null,
      backandErrors: action.errors,
      searchFormValue: null,
    }))
  ),
});

export const {
  name: FilterAccountsFeatureKey,
  reducer: FilterAccountsReducer,
  selectAccounts: selectFilteredAccounts,
  selectBackandErrors,
  selectIsAccountsLoaded: selectIsFilteredAccountsLoaded,
  selectSearchFormValue,
} = FilterAccountsFeature;
