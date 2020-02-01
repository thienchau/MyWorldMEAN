import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../core/service/auth.service';

@Component({
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  logout() {
    this.authService.purgeAuth();
    this.router.navigateByUrl('/login');
  }
}
