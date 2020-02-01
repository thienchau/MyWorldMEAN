import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../core/model/user.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../core/service/user.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {



  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
  ) {

  }


  ngOnDestroy() {
  }

  ngOnInit() {

  }

  logout() {
    this.authService.purgeAuth();
    this.router.navigateByUrl('/login');
  }
}
