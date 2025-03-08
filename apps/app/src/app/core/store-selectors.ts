import { createSelector } from '@ngrx/store';
import { todosState } from './todos-base/todos.state';
import { usersState } from './users-base/users.state';

export const selectTodosForActiveUser = createSelector(
  usersState.selectActiveUserId,
  todosState.selectData,
  (activeUserId, todos) => {
    if (!activeUserId || !todos) {
      return []; // Return empty array if activeUserId or todos is undefined
    }
    return todos.filter((todo) => todo.userId === activeUserId);
  }
);
