import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import {
  map,
  merge,
  Subject
} from 'rxjs';
import { TodoAddFormInstance } from '../../components/todo-add-form/todo-add-form.form';
import { TodosActionsComponent } from '../../components/todos-actions/todos-actions.component';
import { TodosListComponent } from '../../components/todos-list/todos-list.component';
import { TodosCounterComponent } from '../../components/todos-counter/todos-counter.component';
import { todosActions, todosEntity } from '../../core/todos-base/todos.state';
import { TodoAddPayload, TodoUpdatePayload } from '../../core/todos-base/todos.model';
import { filterCompletedTodos } from '../../core/todos-base/todos.utils';
import { TodoAddFormComponent } from '../../components/todo-add-form/todo-add-form.component';

@Component({
  selector: 'z-todos',
  templateUrl: './todos.feature.html',
  styleUrls: [ './todos.feature.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TodoAddFormComponent,
    MatCardModule,
    TodosActionsComponent,
    TodosListComponent,
    TodosCounterComponent
  ]
})
export class TodosFeature {

  // deps
  #todosEntity = todosEntity();
  #store = inject(Store);
  formInstance = inject(TodoAddFormInstance);

  // event streams
  onAdd$ = new Subject<TodoAddPayload>();
  onUpdate$ = new Subject<{ id: number, payload: TodoUpdatePayload; }>();
  onDelete$ = new Subject<number>();
  onMarkAllComplete$ = new Subject<void>();

  // data
  hideCompletedSignal = signal(false);
  todosSignal = toSignal(this.#todosEntity.todos$);
  visibleTodos = computed(() => this.hideCompletedSignal()
    ? filterCompletedTodos(this.todosSignal())
    : this.todosSignal()
  );

  // resolver
  state = computed(() => ({
    todos: this.todosSignal() || [],
    hideCompletedSignal: this.hideCompletedSignal(),
    visibleTodos: this.visibleTodos() || []
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
