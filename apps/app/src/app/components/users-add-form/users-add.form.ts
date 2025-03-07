import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class UsersAddForm {
  protected readonly formGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1)],
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(1),
      ],
      nonNullable: true,
    }),
  });

  public get isFormValid() {
    return this.formGroup.valid;
  }

  public reset() {
    this.formGroup.reset();
  }
}
