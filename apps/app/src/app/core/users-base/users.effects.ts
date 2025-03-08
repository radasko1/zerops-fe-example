import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { UsersAddFormComponent } from '../../components/users-add-form/users-add-form.component';
import { UsersDeleteModalComponent } from '../../components/users-delete-modal/users-delete-modal.component';
import { todosActions } from '../todos-base/todos.state';
import { createUserAction, updateUserAction } from './user.model';
import { UsersApi } from './users.ap';
import { usersActions } from './users.state';

@Injectable()
export class UsersEffects implements OnInitEffects {
  private readonly actions = inject(Actions);
  private readonly clientApi = inject(UsersApi);
  private readonly dialog = inject(MatDialog);

  loadAll$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.load),
      switchMap(() => {
        return this.clientApi.getAll$().pipe(
          map((clients) => {
            return usersActions.loadSuccess({ response: clients });
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
        return (
          response &&
          response[0] &&
          usersActions.select({ clientId: response[0].id })
        );
      })
    );
  });

  select$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.select),
      map(({ clientId }) => todosActions.search({ clientId }))
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

  addNewClient$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.add),
      switchMap(({ payload }) => {
        return this.clientApi.create$(payload).pipe(
          map((client) => usersActions.addSuccess({ response: client })),
          catchError(() => of(usersActions.addFail()))
        );
      })
    );
  });

  updateClient$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.update),
      switchMap(({ payload }) => {
        return this.clientApi.update$(payload).pipe(
          map((client) => usersActions.updateSuccess({ response: client })),
          catchError(() => of(usersActions.updateFail()))
        );
      })
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(usersActions.delete),
      switchMap(({ userId }) => {
        return this.clientApi.delete$(userId).pipe(
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
