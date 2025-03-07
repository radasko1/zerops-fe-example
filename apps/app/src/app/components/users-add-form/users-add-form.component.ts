import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import {
  CreateDialogFormResponse,
  createUserAction,
  UpdateDialogFormResponse,
  updateUserAction,
  userFormAction,
  UserFormData
} from '../../core/clients-base/client.model';

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
  protected readonly matDialogData = inject<{
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

  constructor() {
    if (!this.matDialogData.userData) {
      return;
    }
    this.userFormGroup.patchValue(this.matDialogData.userData);
  }

  // TODO transform to declarative/async
  protected get isFormValid(): boolean {
    return this.userFormGroup.valid;
  }

  protected onModalClose() {
    const clientPayload = this.userFormGroup.getRawValue();
    this.userFormGroup.reset();
    this.userFormGroup.markAsUntouched();

    const action = this.matDialogData.action;
    // create action
    if (action === createUserAction) {
      return this.dialogRef.close({
        action: this.matDialogData.action,
        payload: clientPayload,
      } as CreateDialogFormResponse);
    }
    // update action
    else if (action === updateUserAction) {
      return this.dialogRef.close({
        action: this.matDialogData.action,
        payload: { ...clientPayload, id: this.matDialogData.userData?.id },
      } as UpdateDialogFormResponse);
    }
    return undefined;
  }
}
