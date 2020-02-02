import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostDetailComponent} from './postDetail.component';
import {PostResolver} from './post-resolver.service';

const routes: Routes = [
    {
        path: ':id',
        component: PostDetailComponent,
        resolve: {
            post: PostResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostDetailRoutingModule {
}
