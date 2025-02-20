import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoEntity, TodoUpdatePayload } from '../../core/todos-base/todos.model';

@Component({
  selector: 'z-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TodoItemComponent
  ]
})
export class TodosListComponent {
  todos = input<TodoEntity[]>([]);
  deleteItem = output<number>();
  updateItem = output<{ id: number; payload: TodoUpdatePayload }>();
}
