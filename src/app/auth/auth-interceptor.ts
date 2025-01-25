/*import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
//import { Observable } from 'rxjs';

@Injectable()*/
/*export class AuthInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    console.log(authToken);
    const authRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken}` },
      /*headers: req.headers.set('Authorization', ),
    });
    return next.handle(authRequest);
  }
}*/
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  //constructor(private authService: AuthService) {}
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return next(authRequest);
};
