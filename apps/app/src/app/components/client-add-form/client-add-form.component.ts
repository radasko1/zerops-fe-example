import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
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
  ],
})
export class ClientAddFormComponent {
  private readonly store = inject(Store);
  protected readonly userName = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  protected onSubmit$ = new Subject<void>();
  // Return 'add' action
  private onSubmitAction$ = this.onSubmit$.pipe(
    map(() => this.userName.getRawValue()),
    map((name) => clientsActions.add({ name })),
    tap(() => {
      this.userName.reset();
      this.userName.markAsUntouched();
    })
  );

  constructor() {
    // merge more 'actions' together
    this.onSubmitAction$.pipe(takeUntilDestroyed()).subscribe(this.store);
  }
}
