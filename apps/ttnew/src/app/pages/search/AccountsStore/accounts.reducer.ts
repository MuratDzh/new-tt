import { createFeature, createReducer, on } from '@ngrx/store';
import { AccountsStateInterface } from './accounts-state.interface';
import { AccountsActions } from './accounts.actions';

const AccountsInitialState: AccountsStateInterface = {
  isAccountsLoaded: false,
  accounts: null,
  backandErrors: null,
};

const getAccountsFeature = createFeature({
  name: 'GetAllAccounts',
  reducer: createReducer(
    AccountsInitialState,
    on(AccountsActions.loadAllAccountsSuccess, (state, action) => ({
      ...state,
      accounts: action.accounts,
      isAccountsLoaded: true,
    })),
    on(AccountsActions.loadAllAccountsFealure, (state, action) => ({
      ...state,
      isAccountsLoaded: false,
      accounts: null,
      backandErrors: action.errors,
    }))
  ),
});

export const {
  name: GetAllAccountsFeatureKey,
  reducer: GetAllAccountsReducer,
  selectAccounts,
  selectBackandErrors,
  selectIsAccountsLoaded,
  selectGetAllAccountsState,
} = getAccountsFeature;
