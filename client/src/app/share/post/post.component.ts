import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../core/model/post.model';
import * as moment from 'moment';
import {PostService} from '../../core/service/post.service';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {

    newComment: string;
    @Input()
    post: Post;
    currentUser: User;

    constructor(
        private authService: AuthService,
        private postService: PostService,
        public translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    countTime(date: string): string {
        const postTime = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');
        moment.locale(this.translate.currentLang);
        return postTime.fromNow();
    }

    comment(postId: string) {
        const payload = {
            postId,
            comment: this.newComment
        };
        this.postService.comment(payload).subscribe(data => {
            this.newComment = '';
            this.post.comments.push(data);
        });
    }

    like(postId: string) {
        this.postService.like(postId).subscribe(data => {
            console.log('like success');
        });
    }

    unlike(postId: string) {
        this.postService.unlike(postId).subscribe(data => {
            console.log('Unlike success');
        });
    }

}
