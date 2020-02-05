import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TimelineComponent} from './timeline.component';
import {TimelineLayoutComponent} from './timeline.layout.component';
import {FollowComponent} from './follow.component';
import {TimelineResolver} from './timeline-resolver.service';
import {ProfileComponent} from './profile.component';

const routes: Routes = [
    {
        path: ':id',
        runGuardsAndResolvers: "always",
        component: TimelineLayoutComponent,
        resolve: {
            user: TimelineResolver
        },
        children: [
            {
                path: 'timeline',
                component: TimelineComponent
            },
            {
                path: 'follow',
                component: FollowComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimeLineRoutingModule {
}
