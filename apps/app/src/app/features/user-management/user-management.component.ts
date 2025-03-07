import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { map, merge, Subject } from 'rxjs';
import { Client } from '../../core/clients-base/client.model';
import { clientsActions, clientsState } from '../../core/clients-base/clients.state';

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class UserManagementComponent {
  private readonly store = inject(Store);

  private users$ = this.store.select(clientsState.selectData);

  // Signal
  protected usersList = toSignal(this.users$, { initialValue: [] });
  // Observable trigger
  protected createUser$ = new Subject<void>();
  protected editUser$ = new Subject<Client>();
  protected deleteUser$ = new Subject<string>();

  private createNewUserAction$ = this.createUser$.pipe(
    map(() =>
      clientsActions.showCreateModal()
    )
  );
  private editUserAction$ = this.editUser$.pipe(
    map((userRef) =>
      clientsActions.showEditModal({
        userRef: {
          id: userRef.id,
          email: userRef.email,
          name: userRef.name,
        },
      })
    )
  );
  // TODO confirmation dialog
  private deleteUserAction$ = this.deleteUser$.pipe(
    map((userId) => clientsActions.delete({ userId }))
  );

  constructor() {
    // More actions?
    merge(
      this.createNewUserAction$,
      this.editUserAction$,
      this.deleteUserAction$
    )
      .pipe(takeUntilDestroyed())
      .subscribe(this.store);
  }
}
