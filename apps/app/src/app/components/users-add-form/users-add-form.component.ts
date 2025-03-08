import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { map, startWith } from 'rxjs/operators';
import {
  CreateDialogFormResponse,
  createUserAction,
  UpdateDialogFormResponse,
  updateUserAction,
  userFormAction,
  UserFormData
} from '../../core/users-base/user.model';
import { parseFormData } from '../../utils/parse-form-data.util';

@Component({
  selector: 'users-add-form',
  templateUrl: './users-add-form.component.html',
  styleUrls: ['./users-add-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatButton,
    FormsModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class UsersAddFormComponent {
  private readonly dialogRef = inject(MatDialogRef<UsersAddFormComponent>);
  protected readonly dialogData = inject<{
    action: userFormAction;
    userData?: UserFormData;
  }>(MAT_DIALOG_DATA);

  protected readonly userFormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1)],
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(1),
      ],
      nonNullable: true,
    }),
  });

  protected readonly isEditing = this.dialogData.action === updateUserAction;
  protected readonly isFormValid = toSignal(
    this.userFormGroup.statusChanges.pipe(
      startWith(this.userFormGroup.valid),
      map(() => this.userFormGroup.valid)
    ),
    { initialValue: false }
  );

  constructor() {
    if (this.dialogData.userData) {
      this.userFormGroup.patchValue(this.dialogData.userData);
    }
  }

  protected onModalClose() {
    if (this.userFormGroup.invalid) {
      return;
    }

    const userPayload = parseFormData(this.userFormGroup.getRawValue());
    this.userFormGroup.reset();
    this.userFormGroup.markAsUntouched();

    const response =
      this.dialogData.action === createUserAction
        ? ({
            action: this.dialogData.action,
            payload: userPayload,
          } as CreateDialogFormResponse)
        : ({
            action: this.dialogData.action,
            payload: { ...userPayload, id: this.dialogData.userData?.id },
          } as UpdateDialogFormResponse);

    this.dialogRef.close(response);
  }
}
