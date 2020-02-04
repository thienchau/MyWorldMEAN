import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { JwtService } from '../service/jwt.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private jwtService: JwtService,
    private authService: AuthService,
    private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // bypass oauth token api
    if (req.url.indexOf('/user/login') > 0) {
      return next.handle(req);
    }
    if (req.url.indexOf('/user/register') > 0) {
      return next.handle(req);
    }
    const token = this.jwtService.getToken();
    if (token) {
      return next.handle(
        req.clone({
          headers: req.headers.append('Authorization', 'Bearer ' + token)
        })
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          let errMsg = '';
          // Client Side Error
          if (error.error instanceof ErrorEvent) {
            errMsg = `Error: ${error.error.message}`;
          } else {  // Server Side Error
            errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          if (error.error.err.errorType === '003') {
            this.authService.purgeAuth();
            this.router.navigateByUrl('login');
          }
          return throwError(errMsg);
        })
      );
    }
    return next.handle(req);
  }
}
