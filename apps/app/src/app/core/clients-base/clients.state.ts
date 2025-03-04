import { inject } from '@angular/core';
import { createActionGroup, createFeature, createReducer, emptyProps, on, props, select, Store } from '@ngrx/store';
import { Client, ClientState } from './client.model';

const CLIENT_FEATURE = 'clients';

const initialClientState: ClientState = {
  clients: [],
};

export const clientsActions = createActionGroup({
  source: CLIENT_FEATURE,
  events: {
    init: emptyProps(),
    add: props<{ name: string }>(),
    'add success': props<{ response: Client }>(),
    'add fail': emptyProps(),
  },
});

export const clientsState = createFeature({
  name: CLIENT_FEATURE,
  reducer: createReducer(
    initialClientState,
    on(clientsActions.addSuccess, (state, { response }) => ({
      ...state,
      clients: [...state.clients, response],
    }))
  ),
});

export function clientsEntity() {
  const store = inject(Store);
  return {
    clients$: store.pipe(select(clientsState.selectClients)),
  };
}
