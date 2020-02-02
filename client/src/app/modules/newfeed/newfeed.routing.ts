import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewFeedComponent} from './newfeed.component';

const routes: Routes = [
  {
    path: '',
    component: NewFeedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewFeedRoutingModule {}
