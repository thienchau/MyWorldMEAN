import {NgModule} from '@angular/core';
import {SharedModule} from '../../share/shared.module';
import {PostDetailComponent} from './postDetail.component';
import {PostDetailRoutingModule} from './postDetail.routing';
import {PostResolver} from './post-resolver.service';

@NgModule({
    imports: [PostDetailRoutingModule, SharedModule],
    declarations: [PostDetailComponent],
    exports: [
        PostDetailComponent
    ],
    providers: [PostResolver]
})
export class PostDetailModule {

}
