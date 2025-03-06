import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ClientAddFormComponent } from '../../components/client-add-form/client-add-form.component';
import { todosActions } from '../todos-base/todos.state';
import { ClientsApi } from './clients.api';
import { clientsActions } from './clients.state';

@Injectable()
export class ClientsEffects implements OnInitEffects {
  private readonly actions = inject(Actions);
  private readonly clientApi = inject(ClientsApi);
  private readonly modal = inject(MatDialog);

  loadAll$ = createEffect(() =>
    this.actions.pipe(
      ofType(clientsActions.load),
      switchMap(() =>
        this.clientApi.getAll$().pipe(
          map((clients) => {
            return clientsActions.loadSuccess({ response: clients });
          }),
          catchError(() => of(clientsActions.loadFail()))
        )
      )
    )
  );

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

  openUserFormModal$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(clientsActions.openModal),
        tap(() => this.showUserFormModal())
      );
    },
    {
      dispatch: false,
    }
  );

  addNewClient$ = createEffect(() => {
    return this.actions.pipe(
      ofType(clientsActions.add),
      switchMap(({ clientPayload }) => {
        return this.clientApi.create$(clientPayload).pipe(
          map((client) => clientsActions.addSuccess({ response: client })),
          catchError(() => of(clientsActions.addFail()))
        );
      })
    );
  });

  private showUserFormModal() {
    this.modal.open(ClientAddFormComponent);
  }

  ngrxOnInitEffects() {
    return clientsActions.load();
  }
}
