import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const http   = inject(HttpClient);
  const router = inject(Router);
  const base   = environment.baseURL;

  return http.get<{ isAdmin: boolean }>(`${base}Account/is-admin`, { withCredentials: true }).pipe(
    map(res => {
      if (res.isAdmin) return true;
      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/Account/Login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};
