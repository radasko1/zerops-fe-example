import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { map, merge, Subject } from 'rxjs';
import { TodoAddFormComponent } from '../../components/todo-add-form/todo-add-form.component';
import { TodoAddFormInstance } from '../../components/todo-add-form/todo-add-form.form';
import { TodosActionsComponent } from '../../components/todos-actions/todos-actions.component';
import { TodosClientsComponent } from '../../components/todos-clients/todos-clients.component';
import { TodosCounterComponent } from '../../components/todos-counter/todos-counter.component';
import { TodosListComponent } from '../../components/todos-list/todos-list.component';
import { clientsEntity } from '../../core/clients-base/clients.state';
import { TodoAddPayload, TodoUpdatePayload } from '../../core/todos-base/todos.model';
import { todosActions, todosEntity } from '../../core/todos-base/todos.state';
import { filterCompletedTodos } from '../../core/todos-base/todos.utils';

@Component({
  selector: 'z-todos',
  templateUrl: './todos.feature.html',
  styleUrls: ['./todos.feature.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TodoAddFormComponent,
    MatCardModule,
    TodosActionsComponent,
    TodosListComponent,
    TodosCounterComponent,
    TodosClientsComponent,
  ],
})
export class TodosFeature {
  // deps
  #todosEntity = todosEntity();
  #clientsEntity = clientsEntity();
  #store = inject(Store);
  formInstance = inject(TodoAddFormInstance);

  // event streams
  onAdd$ = new Subject<TodoAddPayload>();
  onUpdate$ = new Subject<{ id: number; payload: TodoUpdatePayload }>();
  onDelete$ = new Subject<number>();
  onMarkAllComplete$ = new Subject<void>();

  // data
  hideCompletedSignal = signal(false);
  todosSignal = toSignal(this.#todosEntity.todos$);
  visibleTodos = computed(() =>
    this.hideCompletedSignal()
      ? filterCompletedTodos(this.todosSignal())
      : this.todosSignal()
  );
  clientsSignal = toSignal(this.#clientsEntity.clients$); // added

  // resolver
  state = computed(() => ({
    todos: this.todosSignal() || [],
    clients: this.clientsSignal() || [], // added
    hideCompletedSignal: this.hideCompletedSignal(),
    visibleTodos: this.visibleTodos() || [],
  }));

  // action streams
  #addAction$ = this.onAdd$.pipe(
    map((payload) => todosActions.add({ payload }))
  );
  #updateAction$ = this.onUpdate$.pipe(
    map(({ id, payload }) => todosActions.update({ id, payload }))
  );
  #deleteAction$ = this.onDelete$.pipe(
    map((id) => todosActions.delete({ id }))
  );
  #markAllCompleteAction$ = this.onMarkAllComplete$.pipe(
    map(() => todosActions.markAllComplete())
  );

  constructor() {
    merge(
      this.#addAction$,
      this.#updateAction$,
      this.#deleteAction$,
      this.#markAllCompleteAction$
    )
      .pipe(takeUntilDestroyed())
      .subscribe(this.#store);
  }
}
