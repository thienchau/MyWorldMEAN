import {NgModule} from '@angular/core';
import {NewFeedRoutingModule} from './newfeed.routing';
import {SharedModule} from '../../share/shared.module';
import {NewFeedComponent} from './newfeed.component';

@NgModule({
    imports: [NewFeedRoutingModule, SharedModule],
    declarations: [NewFeedComponent],
    providers: []
})
export class NewFeedModule {

}
