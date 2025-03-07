import { inject } from '@angular/core';
import { createActionGroup, createFeature, createReducer, emptyProps, on, props, select, Store } from '@ngrx/store';
import {
  Client,
  CreateDialogFormResponse,
  UpdateDialogFormResponse,
  UserFormData,
  UserPayload,
  UserState
} from './client.model';

const CLIENT_FEATURE = 'clients';

const initialClientState: UserState = {
  data: [],
  activeClientId: undefined,
};

export const clientsActions = createActionGroup({
  source: CLIENT_FEATURE,
  events: {
    load: emptyProps(),
    loadSuccess: props<{ response: Client[] }>(),
    loadFail: emptyProps(),

    add: props<{ payload: UserPayload }>(),
    addSuccess: props<{ response: Client }>(),
    addFail: emptyProps(),

    update: props<{ payload: UserFormData }>(),
    updateSuccess: props<{ response: Client }>(),
    updateFail: emptyProps(),

    delete: props<{ userId: string }>(),
    deleteSuccess: props<{ deletedUserId: string }>(),
    deleteFail: emptyProps(),

    select: props<{ clientId: string }>(),

    showCreateModal: emptyProps(),
    showEditModal: props<{ userRef: UserFormData }>(),
    closeModal: props<{
      result: UpdateDialogFormResponse | CreateDialogFormResponse | undefined;
    }>(),
    closeModalSuccess: emptyProps(),
  },
});

export const clientsState = createFeature({
  name: CLIENT_FEATURE,
  reducer: createReducer(
    initialClientState,
    //
    on(clientsActions.loadSuccess, (state, { response }) => ({
      ...state,
      data: response,
    })),
    //
    on(clientsActions.select, (state, { clientId }) => ({
      ...state,
      activeClientId: clientId,
    })),
    //
    on(clientsActions.addSuccess, (state, { response }) => ({
      ...state,
      data: [...state.data, response],
    })),
    on(clientsActions.updateSuccess, (state, { response }) => ({
      ...state,
      data: state.data.map((user) =>
        user.id === response.id ? response : user
      ),
    })),
    //
    on(clientsActions.deleteSuccess, (state, { deletedUserId }) => ({
      ...state,
      data: state.data.filter((user) => user.id !== deletedUserId),
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
