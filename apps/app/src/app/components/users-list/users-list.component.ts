import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { User } from '../../core/users-base/user.model';
import { NameShortcutPipe } from '../../pipes/username-shortcut.pipe';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltip, NameShortcutPipe],
})
export class UsersListComponent {
  users = input<User[]>([]);
  selectedUserId = input<string>();
  onSelect = output<string>();
  onCreateUser = output<void>();
}
