import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TodoAddFormInstance } from './todo-add-form.form';
import { TodoAddPayload } from '../../core/todos-base/todos.model';

@Component({
  selector: 'z-todo-add-form',
  templateUrl: './todo-add-form.component.html',
  styleUrls: ['./todo-add-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class TodoAddFormComponent {
  formInstance = input.required<TodoAddFormInstance>();
  formControls = computed(() => this.formInstance().getControls())
  add = output<TodoAddPayload>();
}
