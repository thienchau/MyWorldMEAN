import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AppComponent } from './app.component';
import {LayoutComponent} from './share/layout/layout.component';
import {AuthGuard} from './core/service/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'timeline',
        loadChildren: './modules/timeline/timeline.module#TimelineModule'
      },
      {
        path: '',
        loadChildren: './modules/newfeed/newfeed.module#NewFeedModule'
      },
      {
        path: 'post',
        loadChildren: './modules/postdetail/postDetail.module#PostDetailModule'
      },
      {
        path: 'search/:key',
        loadChildren: './modules/search/search.module#SearchModule'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
