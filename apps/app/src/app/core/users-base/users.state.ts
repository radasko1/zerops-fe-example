import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import {
  CreateDialogFormResponse,
  UpdateDialogFormResponse,
  User,
  UserFormData,
  UserPayload,
  UserState
} from './user.model';

const USERS_FEATURE_NAME = 'users';

const initialState: UserState = {
  data: [],
  activeUserId: undefined,
};

export const usersActions = createActionGroup({
  source: USERS_FEATURE_NAME,
  events: {
    load: emptyProps(),
    loadSuccess: props<{ response: User[] }>(),
    loadFail: emptyProps(),

    add: props<{ payload: UserPayload }>(),
    addSuccess: props<{ response: User }>(),
    addFail: emptyProps(),

    update: props<{ payload: UserFormData }>(),
    updateSuccess: props<{ response: User }>(),
    updateFail: emptyProps(),

    delete: props<{ userId: string }>(),
    deleteSuccess: props<{ deletedUserId: string }>(),
    deleteFail: emptyProps(),

    select: props<{ userId: string }>(),

    showCreateModal: emptyProps(),
    showEditModal: props<{ userRef: UserFormData }>(),
    showDeleteModal: props<{ userId: string }>(),
    closeModal: props<{
      result: UpdateDialogFormResponse | CreateDialogFormResponse | undefined;
    }>(),
    closeModalSuccess: emptyProps(),
  },
});

export const usersState = createFeature({
  name: USERS_FEATURE_NAME,
  reducer: createReducer(
    initialState,
    //
    on(usersActions.loadSuccess, (state, { response }) => ({
      ...state,
      data: response,
    })),
    //
    on(usersActions.select, (state, { userId: userId }) => ({
      ...state,
      activeUserId: userId,
    })),
    //
    on(usersActions.addSuccess, (state, { response }) => ({
      ...state,
      data: [...state.data, response],
    })),
    //
    on(usersActions.updateSuccess, (state, { response }) => ({
      ...state,
      data: state.data.map((user) =>
        user.id === response.id ? response : user
      ),
    })),
    //
    on(usersActions.deleteSuccess, (state, { deletedUserId }) => ({
      ...state,
      data: state.data.filter((user) => user.id !== deletedUserId),
      activeUserId:
        state.activeUserId === deletedUserId ? undefined : state.activeUserId,
    }))
  ),
});
