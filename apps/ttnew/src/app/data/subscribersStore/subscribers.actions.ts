import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../interfces/profile.interface';
import { BackendErrorsInterface } from '../interfces/backend.errors.interface';
import { Subscribers } from '../interfces/subscribers.interfase';
import { SubEntities } from './subscribers.interface';

export const getSubscribersActions = createActionGroup({
  source: 'Resolver',
  events: {
    'Get Subscribers': props<{ id: number | string }>(),
    'Get Subscribers Success': props<{ subscribers: SubEntities }>(),
    'Get Subscribers Feilure': props<{ errors: BackendErrorsInterface }>(),
  },
});
