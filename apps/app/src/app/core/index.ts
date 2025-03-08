import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TodosEffects } from './todos-base/todos.effects';
import { todosState } from './todos-base/todos.state';
import { UsersEffects } from './users-base/users.effects';
import { usersState } from './users-base/users.state';

export const CORE_EFFECTS = [
  provideEffects([TodosEffects, UsersEffects]),
] as const;

export const CORE_STATE = [
  provideState(todosState),
  provideState(usersState),
] as const;
