import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import { AdvertisementService, ApiService, AuthService, JwtService, FollowService } from './service';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './service/auth-guard.service';
import { UserService } from './service/user.service';
import {PostService} from './service/post.service';
import {DataService} from './service/data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    JwtService,
    AuthService,
    AdvertisementService,
    AuthGuard,
    UserService,
    FollowService,
    PostService,
    DataService
  ],
  exports: [],
  declarations: []
})
export class CoreModule {
}
