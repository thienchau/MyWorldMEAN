import {NgModule} from '@angular/core';
import {SharedModule} from '../../share/shared.module';
import {SearchComponent} from './search.component';
import {SearchRoutingModule} from './search.routing';
import {TimelineModule} from '../timeline/timeline.module';
import {PostDetailModule} from '../postdetail/postDetail.module';

@NgModule({
    imports: [SearchRoutingModule, SharedModule, TimelineModule, PostDetailModule],
    declarations: [SearchComponent],
    providers: []
})
export class SearchModule {

}
