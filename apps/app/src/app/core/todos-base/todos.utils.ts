import { TodoEntity } from './todos.model';

export interface CounterTodos {
  completed: number;
  active: number;
}

export const countTodos = (todos: TodoEntity[] = []): CounterTodos =>
  todos.reduce(
    (acc, todo) => {
      todo.completed ? acc.completed++ : acc.active++;
      return acc;
    },
    { completed: 0, active: 0 }
  );

export const filterCompletedTodos = (todos: TodoEntity[] = []) =>
  todos.filter((todo) => !todo.completed);
