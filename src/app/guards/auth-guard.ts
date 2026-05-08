import { CanActivateFn, Router } from '@angular/router';
import { Data } from '../services/data';
import { inject } from '@angular/core';
import { Ui } from '../services/ui';

export const authGuard: CanActivateFn = (route, state) => {
  const dataService = inject(Data);
  const router = inject(Router);
  const uiService = inject(Ui);

  let token = dataService.loadStorage('TOKEN');
  console.log(token);
  if (token) return true;
  router.navigateByUrl('/login');
  uiService.openSnackBar('Please login to access this page');
  return false;
};
