import { createFeature, createReducer, on } from '@ngrx/store';
import {
  SubEntities,
  SubscribersStateInterface,
} from './subscribers.interface';
import { getSubscribersActions } from './subscribers.actions';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';


export const adapter: EntityAdapter<SubEntities | null> = createEntityAdapter({
  selectId: (m) => m?.idSub!,
});
const SubscribersInitialState: SubscribersStateInterface =
  adapter.getInitialState({});

const getSubscribersFeatureReducer = createFeature({
  name: 'Subscribers',
  reducer: createReducer(
    SubscribersInitialState,
    on(getSubscribersActions.getSubscribersSuccess, (state, action) => {
      return adapter.addOne(action.subscribers, state);
    })
    // on(getSubscribersActions.getSubscribersFeilure, (state, action) => ({
    //     ...state,
    //
    // })
    // )
  ),
});

export const {
  name: getSubscribersFeatureKey,
  reducer: getSubscribersReducer,
  selectSubscribersState,
  selectEntities: selectSubscribers,
  selectIds: selectSubscribersIds,
} = getSubscribersFeatureReducer;
