import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/+todos/todos.feature').then(
        (m) => m.TodosFeature
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
  },
];
