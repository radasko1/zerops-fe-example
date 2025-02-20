import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TodosEffects } from './todos-base/todos.effects';
import { todosState } from './todos-base/todos.state';

export const CORE_EFFECTS = [
  provideEffects(TodosEffects)
] as const;

export const CORE_STATE = [
  provideState(todosState)
] as const;
