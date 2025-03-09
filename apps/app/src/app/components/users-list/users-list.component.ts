import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { User } from '../../core/users-base/user.model';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltip],
})
export class UsersListComponent {
  users = input<User[]>([]);
  selectedUserId = input<string>();
  onSelect = output<string>();
  onCreateUser = output<void>();

  usersList = computed(() => {
    return this.users().map((user) => {
      if (!user.name) {
        return { ...user, username: '?' };
      }

      const initials = user.name
        .split(' ')
        .filter((name) => name !== '')
        .map((name) => name.charAt(0).toUpperCase());

      const transformedName = initials.slice(0, 3).join('');
      return { ...user, username: transformedName };
    });
  });
}
