import {Component, OnInit} from '@angular/core';
import {PostService} from '../../core/service/post.service';
import {Post} from '../../core/model/post.model';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../core/model/user.model';
import {UserService} from '../../core/service/user.service';
import {FollowService} from '../../core/service/follow.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

    searchKey: string;
    users: Array<User> = [];
    posts: Array<Post> = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private postService: PostService,
        private userService: UserService,
        private followService: FollowService,
        public translate: TranslateService) {
    }


    ngOnInit() {
        this.searchKey = this.route.snapshot.paramMap.get('key');
        this.searchUsers();
        this.searchPosts();
    }

    searchUsers() {
        this.userService.search(this.searchKey).subscribe(data => {
            this.users = data.data;
        }, error => {
        });
    }

    searchPosts() {
        this.postService.searchPosts(this.searchKey).subscribe(data => {
            this.posts = data.data;
        }, error => {
        });
    }

    followUser(userId) {
        this.followService.follow(userId).subscribe(data => {
            console.log('followed ... ');
        });
    }

    unFollowUser(userId) {
        this.followService.unFollow(userId).subscribe(data => {
            console.log('Unfollowed ... ');
        });
    }

}
