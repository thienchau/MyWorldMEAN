import {Component, OnInit} from '@angular/core';
import {Post} from '../../core/model/post.model';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-post-detail',
    templateUrl: './postDetail.component.html',
})
export class PostDetailComponent implements OnInit {
    post: Post;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService) {
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.post = data.post;
        });
    }

}
