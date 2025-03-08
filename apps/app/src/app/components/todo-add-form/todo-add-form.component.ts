import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodoAddPayload } from '../../core/todos-base/todos.model';
import { TodoAddFormInstance } from './todo-add-form.form';

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
    MatButtonModule,
  ],
})
export class TodoAddFormComponent {
  formInstance = input.required<TodoAddFormInstance>();
  enableFormControls = input<boolean>(false);
  formControls = computed(() => this.formInstance().getControls());
  add = output<TodoAddPayload>();
}
