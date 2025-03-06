import { inject } from '@angular/core';
import { createActionGroup, createFeature, createReducer, emptyProps, on, props, select, Store } from '@ngrx/store';
import { Client, ClientPayload, ClientState } from './client.model';

const CLIENT_FEATURE = 'clients';

const initialClientState: ClientState = {
  data: [],
  activeClientId: undefined,
};

export const clientsActions = createActionGroup({
  source: CLIENT_FEATURE,
  events: {
    load: emptyProps(),
    loadSuccess: props<{ response: Client[] }>(),
    loadFail: emptyProps(),

    add: props<{ clientPayload: ClientPayload }>(),
    addSuccess: props<{ response: Client }>(),
    addFail: emptyProps(),

    select: props<{ clientId: string }>(),

    openModal: emptyProps(),
  },
});

export const clientsState = createFeature({
  name: CLIENT_FEATURE,
  reducer: createReducer(
    initialClientState,
    on(clientsActions.loadSuccess, (state, { response }) => ({
      ...state,
      data: response,
    })),
    on(clientsActions.addSuccess, (state, { response }) => ({
      ...state,
      data: [...state.data, response],
    })),
    on(clientsActions.select, (state, { clientId }) => ({
      ...state,
      activeClientId: clientId,
    }))
  ),
});

export function clientsEntity() {
  const store = inject(Store);
  return {
    // select{propertyName}
    clients$: store.pipe(select(clientsState.selectData)),
    activeClientId$: store.pipe(select(clientsState.selectActiveClientId)),
  };
}
