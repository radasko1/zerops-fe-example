import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { TodoAddFormInstance } from '../../components/todo-add-form/todo-add-form.form';
import { TodosApi } from './todos.api';
import { todosActions } from './todos.state';

@Injectable()
export class TodosEffects implements OnInitEffects {
  // deps
  #actions$ = inject(Actions);
  #api = inject(TodosApi);
  #snack = inject(MatSnackBar);
  #todoAddFormInstance = inject(TodoAddFormInstance);

  // effects
  searchOnInit$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(todosActions.init),
      switchMap(() =>
        this.#api.search$().pipe(
          map((res) => todosActions.searchSuccess({ res })),
          catchError(() => of(todosActions.searchFail()))
        )
      )
    )
  );

  search$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(todosActions.search),
      switchMap(({ clientId }) =>
        this.#api.search$(clientId).pipe(
          map((res) => todosActions.searchSuccess({ res })),
          catchError(() => of(todosActions.searchFail()))
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(todosActions.add),
      switchMap(({ payload }) =>
        this.#api.add$(payload).pipe(
          map((res) => todosActions.addSuccess({ res })),
          catchError(() => of(todosActions.addFail()))
        )
      )
    )
  );

  onAddResetAddForm$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(todosActions.addSuccess),
        tap(() => this.#todoAddFormInstance.reset())
      ),
    { dispatch: false }
  );

  onAddSuccessShowSnackbar$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(todosActions.addSuccess),
        tap(() => this.#openSnack('Úkol přidán'))
      ),
    { dispatch: false }
  );

  update$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(todosActions.update),
      switchMap(({ id, payload }) =>
        this.#api.update$(id, payload).pipe(
          map((res) => todosActions.updateSuccess({ res })),
          catchError(() => of(todosActions.updateFail()))
        )
      )
    )
  );

  onUpdateSuccessShowSnackbar$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(todosActions.updateSuccess),
        tap(() => this.#openSnack('Úkol upraven'))
      ),
    { dispatch: false }
  );

  delete$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(todosActions.delete),
      mergeMap(({ id }) =>
        this.#api.delete$(id).pipe(
          map(() => todosActions.deleteSuccess({ id })),
          catchError(() => of(todosActions.updateFail()))
        )
      )
    )
  );

  onDeleteSuccessShowSnackbar$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(todosActions.deleteSuccess),
        tap(() => this.#openSnack('Úkol smazán'))
      ),
    { dispatch: false }
  );

  markAllComplete$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(todosActions.markAllComplete),
      switchMap(() =>
        this.#api.markAllComplete$().pipe(
          map(() => todosActions.markAllCompleteSuccess()),
          catchError(() => of(todosActions.markAllCompleteFail()))
        )
      )
    )
  );

  onMarkAllCompleteSuccessShowSnackbar$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(todosActions.markAllCompleteSuccess),
        tap(() => this.#openSnack('Vše označeno jako vyřešené'))
      ),
    { dispatch: false }
  );

  #openSnack(message: string) {
    this.#snack.open(message, 'Zavřít', { horizontalPosition: 'start' });
  }

  ngrxOnInitEffects() {
    return todosActions.init();
  }
}
