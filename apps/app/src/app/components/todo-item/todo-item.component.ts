import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TodoEntity, TodoUpdatePayload } from '../../core/todos-base/todos.model';

@Component({
  selector: 'z-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TodoItemComponent {
  form = new FormGroup({
    text: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    completed: new FormControl<boolean>(
      false,
      { nonNullable: true }
    )
  });

  data = input.required<TodoEntity>();
  delete = output<void>();
  update = output<TodoUpdatePayload>();

  constructor() {
    effect(() => {
      const value = this.data();
      if (!value) return;

      this.form.setValue({
        completed: value.completed,
        text: value.text
      });
    });
  }
}
