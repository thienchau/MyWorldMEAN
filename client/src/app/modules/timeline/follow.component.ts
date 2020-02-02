import {Component, OnInit} from '@angular/core';
import {Follow} from '../../core/model/follow.model';
import {FollowService} from '../../core/service/follow.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-follow',
    templateUrl: './follow.component.html',
})


export class FollowComponent implements OnInit {

    followers: Array<Follow> = [];
    following: Array<Follow> = [];

    constructor(private followService: FollowService , public translate: TranslateService) {
    }

    ngOnInit() {
        this.loadFollowers();
        this.loadFollowing();
    }

    loadFollowers() {
        this.followService.getFollowers().subscribe(
            result => {
                this.followers = result.data;
            }, error => {
            });
    }

    loadFollowing() {
        this.followService.getFollowing().subscribe(
            result => {
                this.following = result.data;
            }, error => {
            });
    }

    followUser(userId) {
        this.followService.follow(userId).subscribe(data => {
            this.loadFollowers();
            this.loadFollowing();
        });
    }

    unFollowUser(userId) {
        this.followService.unFollow(userId).subscribe(data => {
            this.loadFollowers();
            this.loadFollowing();
        });
    }

    checkFollowed(user) {
      let index = this.following.findIndex(follow => follow._id === user._id);
      return index !== -1;
    }

}
