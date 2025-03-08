import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'z-todos-actions',
  templateUrl: './todos-actions.component.html',
  styleUrl: './todos-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggleModule, MatButtonModule, MatIconModule],
})
export class TodosActionsComponent {
  hideCompletedState = input(false);
  markAllComplete = output<void>();
  toggleCompleted = output<boolean>();
}
