import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      const message = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      console.error(`[HTTP Error] ${err.status}: ${message}`);
      return throwError(() => ({ ...err, userMessage: message }));
    })
  );
};