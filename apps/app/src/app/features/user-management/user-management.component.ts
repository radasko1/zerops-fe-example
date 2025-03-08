import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, merge, Subject } from 'rxjs';
import { User } from '../../core/users-base/user.model';
import { usersActions, usersState } from '../../core/users-base/users.state';

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatAnchor,
    RouterLink,
  ],
})
export class UserManagementComponent {
  private readonly store = inject(Store);

  private users$ = this.store.select(usersState.selectData);

  // Signal
  protected usersList = toSignal(this.users$, { initialValue: [] });
  // Observable trigger
  protected createUser$ = new Subject<void>();
  protected editUser$ = new Subject<User>();
  protected deleteUser$ = new Subject<string>();

  protected readonly tableColumns = ['name', 'email', 'actions'];

  private createNewUserAction$ = this.createUser$.pipe(
    map(() => usersActions.showCreateModal())
  );
  private editUserAction$ = this.editUser$.pipe(
    map((userRef) =>
      usersActions.showEditModal({
        userRef: {
          id: userRef.id,
          email: userRef.email,
          name: userRef.name,
        },
      })
    )
  );
  private deleteUserAction$ = this.deleteUser$.pipe(
    map((userId) => usersActions.showDeleteModal({ userId }))
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
