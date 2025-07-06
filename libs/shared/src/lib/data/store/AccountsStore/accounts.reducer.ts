import { createFeature, createReducer, on } from '@ngrx/store';
import { AccountsStateInterface } from './accounts-state.interface';
import { AccountsActions } from './accounts.actions';
import {Subscribers} from "@tt/interfaces/subscribers";
import {Profile} from "@tt/interfaces/profile"

const AccountsInitialState: AccountsStateInterface = {
  isAccountsLoaded: false,
  accounts: null,
  backandErrors: null,
  page:1,
  size:10,
  pages:1,
  total:0,
};

const getAccountsFeature = createFeature({
  name: 'GetAllAccounts',
  reducer: createReducer(
    AccountsInitialState,
    on(AccountsActions.loadAllAccountsSuccess, (state, action) => {
      let accounts :Subscribers<Profile> = {
        ...state.accounts as Subscribers<Profile>,

        items: (state.accounts?.items as Profile[])?(state.accounts?.items  as Profile[]).concat(action.accounts?.items as Profile[]):action.accounts?.items  as Profile[],
      };
      console.log('222')
      console.log('action.accounts!.page', action.accounts!.page);
      console.log('state.page', state.page);
      console.log("state.accounts!.items![0]",state.accounts?.items?.[0])
      console.log("actions.accounts!.items![0]",action.accounts?.items?.[0]);
      
      
        return {
          ...state,
          accounts:
            state.page !== action.accounts!.page
              ? action.accounts ? action.accounts : state.accounts
              : accounts,
          isAccountsLoaded: true,
          pages: action.accounts!.pages as number,
          total: action.accounts!.total,
        };
    }),
    on(AccountsActions.setPage, (state, action) => ({
      ...state,
      page: action.page? action.page + 1 : state.page + 1,
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
  selectPage,
  selectSize
} = getAccountsFeature;
