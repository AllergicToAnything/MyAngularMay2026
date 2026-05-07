import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModules } from '../shared/shared.module';

@Injectable({
  providedIn: 'root',
})
export class Ui {
  constructor(public snackbar: MatSnackBar) {}
  openSnackBar(message: string, action?: string) {
    this.snackbar.open(message, action, { duration: 3000 });
  }
}
