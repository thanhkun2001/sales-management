import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Gắn token vào header
  const authReq = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(authReq).pipe(
    catchError(err => {
      // Nếu token hết hạn → thử refresh
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(res => {
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`)
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.logout().subscribe();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};