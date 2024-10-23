import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  if(loginService.isLogged) {
    if(loginService.usuario.role === 'ADMIN') {
      router.navigateByUrl('/pages/home');
    }
    
    if(loginService.usuario.role === 'FINZ') {
      router.navigateByUrl('/pages/cash-outlay');
    }
    return false;
  } else {
    return true;
  }

};
