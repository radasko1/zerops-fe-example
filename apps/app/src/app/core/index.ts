import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ClientsEffects } from './clients-base/clients.effects';
import { clientsState } from './clients-base/clients.state';
import { TodosEffects } from './todos-base/todos.effects';
import { todosState } from './todos-base/todos.state';

export const CORE_EFFECTS = [
  provideEffects([TodosEffects, ClientsEffects]),
] as const;

export const CORE_STATE = [
  provideState(todosState),
  provideState(clientsState),
] as const;
