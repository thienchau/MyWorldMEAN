import {Component, OnInit} from '@angular/core';
import {Post} from '../../core/model/post.model';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../core/service/post.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
})
export class TimelineComponent implements OnInit {
    posts: Array<Post> = [];
    userSub: any;
    userId: string;
    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        public translate: TranslateService) {
        this.userSub = this.route.parent.params.subscribe(params => {
            this.userId = params['id'];
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.loadPost(this.userId, 0);
        });
    }

    loadPost(userId: string, page: number) {
        this.postService.getTimeline(userId, page).subscribe(result => {
          this.posts = result.data;
        });
    }
}
