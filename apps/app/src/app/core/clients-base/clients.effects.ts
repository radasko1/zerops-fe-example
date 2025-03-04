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
          map((clients) => clientsActions.loadSuccess({ response: clients })),
          catchError(() => of(clientsActions.loadFail()))
        )
      )
    )
  );

  select$ = createEffect(() =>
    this.actions.pipe(
      ofType(clientsActions.select),
      map(({ clientId }) => todosActions.search({ clientId }))
    )
  );

  openUserFormModal$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(clientsActions.openModal),
        tap(() => this.showUserFormModal())
      ),
    {
      dispatch: false,
    }
  );

  addNewClient$ = createEffect(() =>
    this.actions.pipe(
      ofType(clientsActions.add),
      switchMap(({ name }) =>
        this.clientApi.create$(name).pipe(
          map((client) => clientsActions.addSuccess({ response: client })),
          catchError(() => of(clientsActions.addFail()))
        )
      )
    )
  );

  private showUserFormModal() {
    this.modal.open(ClientAddFormComponent);
  }

  ngrxOnInitEffects() {
    return clientsActions.load();
  }
}
