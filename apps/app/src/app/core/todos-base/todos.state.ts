import { inject } from '@angular/core';
import {
  Store,
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
  select
} from '@ngrx/store';
import {
  FEATURE_NAME,
  TodoAddPayload,
  TodoAddResponse,
  TodoEntity,
  TodosState,
  TodoUpdatePayload,
  TodoUpdateResponse
} from './todos.model';

const initialState: TodosState = {
  data: []
};

export const todosActions = createActionGroup({
  source: FEATURE_NAME,
  events: {
    'init': emptyProps(),

    'add': props<{ payload: TodoAddPayload; }>(),
    'add success': props<{ res: TodoAddResponse; }>(),
    'add fail': emptyProps(),

    'update': props<{ id: number, payload: TodoUpdatePayload; }>(),
    'update success': props<{ res: TodoUpdateResponse; }>(),
    'update fail': emptyProps(),

    'delete': props<{ id: number }>(),
    'delete success': props<{ id: number }>(),
    'delete fail': emptyProps(),

    'search': props<{ clientId: string; }>(),
    'search success': props<{ res: TodoEntity[]; }>(),
    'search fail': emptyProps(),

    'mark all complete': emptyProps(),
    'mark all complete success': emptyProps(),
    'mark all complete fail': emptyProps()
  }
});

export const todosState = createFeature({
  name: FEATURE_NAME,
  reducer: createReducer(
    initialState,
    on(todosActions.searchSuccess, (state, { res }) => ({
      ...state,
      data: res
    })),
    on(todosActions.addSuccess, (state, { res }) => ({
      ...state,
      data: [ res, ...state.data ]
    })),
    on(todosActions.updateSuccess, (state, { res }) => ({
      ...state,
      data: state.data.map((todo) => {
        if (todo.id !== res.id) { return todo; }
        return { ...todo, ...res };
      })
    })),
    on(todosActions.deleteSuccess, (state, { id }) => ({
      ...state,
      data: state.data.filter((todo) => todo.id !== id)
    })),
    on(todosActions.markAllCompleteSuccess, (state) => ({
      ...state,
      data: state.data.map((todo) => ({ ...todo, completed: true }))
    }))
  )
});

export function todosEntity() {
  const store = inject(Store);
  return {
    todos$: store.pipe(select(todosState.selectData))
  };
}
