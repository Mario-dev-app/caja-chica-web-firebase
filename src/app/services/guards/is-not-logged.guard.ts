import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login.service';

export const isNotLoggedGuard: CanActivateFn = (route, state) => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  if(!loginService.isLogged) {
    router.navigateByUrl('/login');
    return false;
  }else {
    return true;
  }

};
