import {Component, OnInit} from '@angular/core';
import {PostService} from '../../core/service/post.service';
import {Post} from '../../core/model/post.model';
import {Router} from '@angular/router';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    templateUrl: './newfeed.component.html',
})
export class NewFeedComponent implements OnInit {

    posts: Array<Post> = [];
    newPostText: string;
    notify: boolean;
    newComment: string;
    currentUser: User;
    page = 0;

    constructor(
        private router: Router,
        private authService: AuthService,
        private postService: PostService,
        public translate: TranslateService) {
    }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.loadPost(this.page);
        this.initScript();
    }

    loadMore() {
        this.loadPost(++this.page);
    }

    createPost(event) {
        this.postService.newPost(this.newPostText, this.notify).subscribe(data => {
            this.newPostText = '';
            $('.postoverlay').fadeOut(500);
            if (event.target.files && event.target.files.length) {
                const formData = new FormData();
                formData.append('postId', data.id);
                for (const file of event.target.files) {
                    formData.append('files', file);
                }
                this.postService.uploadMedia(formData).subscribe(result => {
                    this.posts.unshift(result);
                    console.log('upload success ....');
                });
            } else {
                this.posts.unshift(data);
            }
        });
    }

    loadPost(page: number) {
        this.postService.getNewFeed(page).subscribe(data => {
            data.forEach(post => {
                this.posts.push(post);
            });
        });
    }

    comment(postId: string) {
        const payload = {
            postId,
            comment: this.newComment
        };
        this.postService.comment(payload).subscribe(data => {
            console.log('comment success');
        });
    }

    initScript() {
        // new post box
        $('.new-postbox').click(function() {
            $('.postoverlay').fadeIn(500);
        });

        $('.postoverlay').not('.new-postbox').click(function() {
            $('.postoverlay').fadeOut(500);
        });
    }
}
