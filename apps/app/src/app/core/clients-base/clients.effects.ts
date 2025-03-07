import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { UsersAddFormComponent } from '../../components/users-add-form/users-add-form.component';
import { todosActions } from '../todos-base/todos.state';
import { createUserAction, updateUserAction } from './client.model';
import { clientsActions } from './clients.state';
import { UsersApi } from './users-api.service';

@Injectable()
export class ClientsEffects implements OnInitEffects {
  private readonly actions = inject(Actions);
  private readonly clientApi = inject(UsersApi);
  private readonly modal = inject(MatDialog);

  loadAll$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.load),
      switchMap(() => {
        return this.clientApi.getAll$().pipe(
          map((clients) => {
            return clientsActions.loadSuccess({ response: clients });
          }),
          catchError(() => of(clientsActions.loadFail()))
        );
      })
    );
  });

  selectFirstUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.loadSuccess),
      map(({ response }) => {
        return (
          response &&
          response[0] &&
          clientsActions.select({ clientId: response[0].id })
        );
      })
    );
  });

  select$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.select),
      map(({ clientId }) => todosActions.search({ clientId }))
    );
  });

  showCreateModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.showCreateModal),
      switchMap(() => {
        return this.showUserFormModal({
          data: {
            action: createUserAction,
          },
        })
          .afterClosed()
          .pipe(
            map((dialogResult) => {
              return clientsActions.closeModal({ result: dialogResult });
            })
          );
      })
    );
  });

  showUpdateModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.showEditModal),
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
              return clientsActions.closeModal({ result: dialogResult });
            })
          )
      )
    );
  });

  closeModal$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.closeModal),
      map(({ result }) => {
        // Update
        if (result && result.action === updateUserAction) {
          return clientsActions.update({ payload: result.payload });
        }
        // Create
        else if (result && result.action === createUserAction) {
          return clientsActions.add({ payload: result.payload });
        }
        return clientsActions.closeModalSuccess();
      })
    );
  });

  addNewClient$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.add),
      switchMap(({ payload }) => {
        return this.clientApi.create$(payload).pipe(
          map((client) => clientsActions.addSuccess({ response: client })),
          catchError(() => of(clientsActions.addFail()))
        );
      })
    );
  });

  updateClient$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.update),
      switchMap(({ payload }) => {
        return this.clientApi.update$(payload).pipe(
          map((client) => clientsActions.updateSuccess({ response: client })),
          catchError(() => of(clientsActions.updateFail()))
        );
      })
    );
  });

  // TODO add confirmation dialog
  deleteUser$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.delete),
      switchMap(({ userId }) => {
        return this.clientApi.delete$(userId).pipe(
          map(() =>
            clientsActions.deleteSuccess({
              deletedUserId: userId,
            })
          ),
          catchError(() => of(clientsActions.deleteFail()))
        );
      })
    );
  });

  private showUserFormModal(config?: MatDialogConfig) {
    return this.modal.open<UsersAddFormComponent>(
      UsersAddFormComponent,
      config
    );
  }

  ngrxOnInitEffects() {
    return clientsActions.load();
  }
}
