import { createFeature, createReducer, on } from '@ngrx/store';
import { FilterAccountsActions } from './filter-accounts.actions';

import { FilterAccountsInterface } from './filter-accounts.state.interface';
import { Profile } from '@tt/interfaces/profile';
import { Subscribers } from '@tt/interfaces/subscribers';


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
      let accounts :Subscribers<Profile> = {
        ...state.accounts as Subscribers<Profile>,

        items: (state.accounts?.items as Profile[])?(state.accounts?.items  as Profile[]).concat(action.accounts?.items as Profile[]):action.accounts?.items  as Profile[],
      };
      console.log('state.accounts?.page', state.accounts?.page);
      console.log('action.accounts.page', action.accounts.page);
      console.log(
        action.accounts.pages<action.accounts.page?"yes":action.accounts
      );
      console.log(
        '~~~~~~~~~~',
        action.accounts.total > action.accounts.size &&
          action.accounts.page !== 1
          ? accounts
          : action.accounts.page == 1
            ? action.accounts
            : accounts
      );
     
      console.log("accounts", accounts);
      return {
        ...state,
        accounts:
          action.accounts.total > action.accounts.size &&
          action.accounts.page !== 1
            ? accounts
            : action.accounts.page == 1
            ? action.accounts
            : accounts,

        isAccountsLoaded: true,
      };
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
