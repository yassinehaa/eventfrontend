import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable,  } from 'rxjs';
import { AuthService } from './auth.service';
import {inject} from "@angular/core";

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
}
