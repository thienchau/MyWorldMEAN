import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AppComponent } from './app.component';
import {LayoutComponent} from './share/layout/layout.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'timeline',
        loadChildren: './modules/timeline/timeline.module#TimelineModule'
      },
      {
        path: '',
        loadChildren: './modules/newfeed/newfeed.module#NewFeedModule'
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
