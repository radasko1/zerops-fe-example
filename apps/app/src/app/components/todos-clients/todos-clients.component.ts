import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { map, merge, Subject } from 'rxjs';
import { Client } from '../../core/clients-base/client.model';
import { clientsActions, clientsEntity } from '../../core/clients-base/clients.state';

@Component({
  selector: 'z-todos-clients',
  templateUrl: './todos-clients.component.html',
  styleUrls: ['./todos-clients.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltip],
})
export class TodosClientsComponent {
  private readonly store = inject(Store);
  private readonly clientsEntity = clientsEntity();

  clients = input<Client[]>([]);
  activeClientId = toSignal(this.clientsEntity.activeClientId$);

  protected onSelect$ = new Subject<Client>();
  protected openUserForm$ = new Subject<void>();
  // Return 'select' action
  private onSelectAction$ = this.onSelect$.pipe(
    map(({ id }) => clientsActions.select({ clientId: id }))
  );
  // Return 'openModal' action
  private openUserFormDialog$ = this.openUserForm$.pipe(
    map(() => clientsActions.openModal())
  );

  // dispatch store action
  constructor() {
    merge(this.onSelectAction$, this.openUserFormDialog$)
      .pipe(takeUntilDestroyed())
      .subscribe(this.store);
  }
}
