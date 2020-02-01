import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    this.authService.isAuthenticated.subscribe(loggined => {
      if (!loggined) {
        // not logged in so redirect to login page with the return url and return false
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return new Observable<false>();
      }
    });
    return this.authService.isAuthenticated.pipe(take(1));

  }
}
