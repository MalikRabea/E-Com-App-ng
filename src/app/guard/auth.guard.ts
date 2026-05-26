import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const _http = inject(HttpClient);
  const router = inject(Router);
  const baseURL = environment.baseURL;

  return _http.get<{ isAuthenticated: boolean }>(`${baseURL}Account/IsUserAuth`, { withCredentials: true }).pipe(
    map(res => {
      if (res.isAuthenticated) return true;

      router.navigate(['/Account/Login'], { queryParams: { returnUrl: state.url } });
      return false;
    }),
    catchError(() => {
      router.navigate(['/Account/Login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};
