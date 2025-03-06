import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { map, Subject, tap } from 'rxjs';
import { clientsActions } from '../../core/clients-base/clients.state';

@Component({
  selector: 'c-add-form',
  templateUrl: './client-add-form.component.html',
  styleUrls: ['./client-add-form.component.css'],
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
export class ClientAddFormComponent {
  private readonly store = inject(Store);

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

  protected createClient$ = new Subject<void>();
  // Return 'add' action
  private createNewClient$ = this.createClient$.pipe(
    map(() => {
      const clientPayload = this.userFormGroup.getRawValue();
      return clientsActions.add({ clientPayload });
    }),
    tap(() => {
      this.userFormGroup.reset();
      this.userFormGroup.markAsUntouched();
    })
  );

  constructor() {
    // merge more 'actions' together
    this.createNewClient$.pipe(takeUntilDestroyed()).subscribe(this.store);
  }

  // TODO transform to declarative/async
  protected get isFormValid(): boolean {
    return this.userFormGroup.valid;
  }
}
