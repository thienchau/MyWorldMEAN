import {NgModule} from '@angular/core';
import {SharedModule} from '../../share/shared.module';
import {TimelineComponent} from './timeline.component';
import {TimeLineRoutingModule} from './timeline.routing';
import {TimelineLayoutComponent} from './timeline.layout.component';
import {FollowComponent} from './follow.component';
import {TimelineHeaderComponent} from './timeline-header.component';
import {TimelineResolver} from './timeline-resolver.service';
import {ProfileComponent} from './profile.component';

@NgModule({
  imports: [TimeLineRoutingModule, SharedModule],
  declarations: [TimelineHeaderComponent,
    TimelineComponent,
    FollowComponent,
    TimelineLayoutComponent,
    ProfileComponent
  ],
  exports: [
    TimelineHeaderComponent
  ],
  providers: [TimelineResolver]
})
export class TimelineModule {

}
