import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Client } from '../../core/clients-base/client.model';

@Component({
  selector: 'z-todos-clients',
  templateUrl: './todos-clients.component.html',
  styleUrls: ['./todos-clients.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TodosClientsComponent {
  clients = input<Client[]>([]);
}
