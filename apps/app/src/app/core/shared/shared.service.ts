import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly snack = inject(MatSnackBar);

  public openSnack(message: string) {
    this.snack.open(message, 'Zavřít', { horizontalPosition: 'start' });
  }
}
