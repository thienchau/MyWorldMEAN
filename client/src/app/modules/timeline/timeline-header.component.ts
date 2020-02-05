import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth.service';
import {UserService} from '../../core/service/user.service';
import {FollowService} from '../../core/service/follow.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-timeline-header',
    templateUrl: './timeline-header.component.html',
})
export class TimelineHeaderComponent implements OnInit {

    @Input()
    user: User;
    currentUser: User;

    constructor(private authService: AuthService,
                private userService: UserService,
                private followService: FollowService,
                public translate: TranslateService) {
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    isMyProfile() {
        return this.currentUser._id === this.user._id;
    }

    onFileChange(event) {
        if (event.target.files && event.target.files.length) {
            const fileSelected: File = event.target.files[0];
            this.uploadAvatar(fileSelected);
        }
    }

    uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('avatar', file, file.name);
        this.userService.uploadAvatar(formData).subscribe(result => {
            $('#avatar').attr('src', result.data);
            $('#avatar_header').attr('src', result.data);
        });

    }

    follow(userId) {
        this.user.followed = true;
        this.followService.follow(userId).subscribe(data => {
            this.user.numFollower++ ;
        });
    }

    unFollow(userId) {
        this.user.followed = false;
        this.followService.unFollow(userId).subscribe(data => {
            this.user.numFollower-- ;
        });
    }
}
