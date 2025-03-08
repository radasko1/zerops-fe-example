import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'users-delete-modal',
  templateUrl: './users-delete-modal.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class UsersDeleteModalComponent {
  private readonly dialogRef = inject(MatDialogRef<UsersDeleteModalComponent>);
  protected readonly dialogData = inject<{
    userId: string;
  }>(MAT_DIALOG_DATA);

  protected onConfirm() {
    this.dialogRef.close({ userId: this.dialogData.userId });
  }
}
