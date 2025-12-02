import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {map, take, filter} from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    // small delay to ensure AuthService.authReady signal processed — but prefer checking authService.authReady() directly
    filter(() => authService.authReady()),
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']).then(r => console.log('[AuthGuard] redirect to /login', r));
        return false;
      }
    })
  );
};
