import { createFeature, createReducer, on } from '@ngrx/store';
import { FilterAccountsActions } from './filter-accounts.actions';

import { FilterAccountsInterface } from './filter-accounts.state.interface';
import {Profile} from "@tt/interfaces/profile";

const AccountsInitialState: FilterAccountsInterface = {
  isAccountsLoaded: false,
  accounts: null,
  backandErrors: null,
  searchFormValue: null,
  page:1,
  size:10
};

const FilterAccountsFeature = createFeature({
  name: 'FilterAccounts',
  reducer: createReducer(
    AccountsInitialState,
    on(FilterAccountsActions.filterAccounts, (state, action) => ({
      ...state,
      accounts: null,
      searchFormValue: action.searchFormValue,
      page: 1
    })),
    on(FilterAccountsActions.filterAccountsSuccess, (state, action) => {
      let accounts = {
        ...action.accounts,
        items: (state.accounts?.items as Profile[])?(state.accounts?.items  as Profile[]).concat(action.accounts.items as Profile[]):action.accounts.items  as Profile[],
      };
      // console.log("accounts", accounts);
      return {
        ...state,
        accounts: accounts,
        isAccountsLoaded: true,
      }
    }),
    on(FilterAccountsActions.setPage, (state, action) => ({
      ...state,
      page: action.page? action.page + 1 : state.page + 1,
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
  selectBackandErrors: selectFilteredAccountsBackandErrors,
  selectIsAccountsLoaded: selectIsFilteredAccountsLoaded,
  selectSearchFormValue,
  selectPage: selectFilteredPage,
  selectSize: selectFilteredSize,
} = FilterAccountsFeature;
