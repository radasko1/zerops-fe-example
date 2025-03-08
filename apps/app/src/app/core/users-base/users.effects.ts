import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { UsersAddFormComponent } from '../../components/users-add-form/users-add-form.component';
import { UsersDeleteModalComponent } from '../../components/users-delete-modal/users-delete-modal.component';
import { SharedService } from '../shared/shared.service';
import { createUserAction, updateUserAction } from './user.model';
import { UsersApi } from './users.api';
import { usersActions } from './users.state';

@Injectable()
export class UsersEffects implements OnInitEffects {
  private readonly actions = inject(Actions);
  private readonly usersApi = inject(UsersApi);
  private readonly dialog = inject(MatDialog);
  private readonly shared = inject(SharedService);

  loadAll$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.load),
      switchMap(() => {
        return this.usersApi.getAll$().pipe(
          map((users) => {
            return usersActions.loadSuccess({ response: users });
          }),
          catchError(() => of(usersActions.loadFail()))
        );
      })
    );
  });

  selectFirstUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.loadSuccess),
      map(({ response }) => {
        const userId = (response && response[0]?.id) ?? undefined;
        return usersActions.select({ userId });
      }),
      catchError(() => of(usersActions.loadFail()))
    );
  });

  showCreateModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.showCreateModal),
      switchMap(() => {
        return this.showUserFormModal({
          data: {
            action: createUserAction,
          },
        })
          .afterClosed()
          .pipe(
            map((dialogResult) => {
              return usersActions.closeModal({ result: dialogResult });
            })
          );
      })
    );
  });

  showUpdateModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.showEditModal),
      switchMap(({ userRef }) =>
        this.showUserFormModal({
          data: {
            action: updateUserAction,
            userData: userRef,
          },
        })
          .afterClosed()
          .pipe(
            map((dialogResult) => {
              return usersActions.closeModal({ result: dialogResult });
            })
          )
      )
    );
  });

  showDeleteModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.showDeleteModal),
      switchMap(({ userId }) => {
        return this.dialog
          .open(UsersDeleteModalComponent, {
            data: {
              userId,
            },
          })
          .afterClosed()
          .pipe(
            map((userId) => {
              return userId
                ? usersActions.delete(userId)
                : usersActions.closeModalSuccess();
            })
          );
      })
    );
  });

  closeModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.closeModal),
      map(({ result }) => {
        // Update
        if (result && result.action === updateUserAction) {
          return usersActions.update({ payload: result.payload });
        }
        // Create
        else if (result && result.action === createUserAction) {
          return usersActions.add({ payload: result.payload });
        }
        return usersActions.closeModalSuccess();
      })
    );
  });

  addNewUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.add),
      switchMap(({ payload }) => {
        return this.usersApi.create$(payload).pipe(
          map((user) => usersActions.addSuccess({ response: user })),
          catchError(() => of(usersActions.addFail()))
        );
      })
    );
  });

  addUserSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(usersActions.addSuccess),
        tap(() => this.shared.openSnack('Uživatel přidán'))
      ),
    { dispatch: false }
  );

  updateUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.update),
      switchMap(({ payload }) => {
        return this.usersApi.update$(payload).pipe(
          map((user) => usersActions.updateSuccess({ response: user })),
          catchError(() => of(usersActions.updateFail()))
        );
      })
    );
  });

  updateUserSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(usersActions.updateSuccess),
        tap(() => this.shared.openSnack('Uživatel upraven'))
      ),
    { dispatch: false }
  );

  deleteUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.delete),
      switchMap(({ userId }) => {
        return this.usersApi.delete$(userId).pipe(
          map(() =>
            usersActions.deleteSuccess({
              deletedUserId: userId,
            })
          ),
          catchError(() => of(usersActions.deleteFail()))
        );
      })
    );
  });

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(usersActions.deleteSuccess),
        tap(() =>
          this.shared.openSnack('Uživatel byl odebrán společně s jeho úkoly')
        )
      ),
    { dispatch: false }
  );

  private showUserFormModal(config?: MatDialogConfig) {
    return this.dialog.open<UsersAddFormComponent>(
      UsersAddFormComponent,
      config
    );
  }

  ngrxOnInitEffects() {
    return usersActions.load();
  }
}
