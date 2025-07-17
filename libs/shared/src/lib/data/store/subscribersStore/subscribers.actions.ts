import { createActionGroup,  props } from '@ngrx/store';

import { BackendErrorsInterface } from '@tt/interfaces/backend-errors';

import { SubEntities } from './subscribers.interface';

export const getSubscribersActions = createActionGroup({
  source: 'Resolver',
  events: {
    'Get Subscribers': props<{ id: number | string }>(),
    'Get Subscribers Success': props<{ subscribers: SubEntities }>(),
    'Get Subscribers Feilure': props<{ errors: BackendErrorsInterface }>(),
  },
});
