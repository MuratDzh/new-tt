import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { BackendErrorsInterface } from '../../../../../../interfaces/src/lib/backend-errors/backend.errors.interface';

import { SubEntities } from './subscribers.interface';

export const getSubscribersActions = createActionGroup({
  source: 'Resolver',
  events: {
    'Get Subscribers': props<{ id: number | string }>(),
    'Get Subscribers Success': props<{ subscribers: SubEntities }>(),
    'Get Subscribers Feilure': props<{ errors: BackendErrorsInterface }>(),
  },
});
