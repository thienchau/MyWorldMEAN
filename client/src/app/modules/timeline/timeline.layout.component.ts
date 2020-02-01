import {Component, OnInit} from '@angular/core';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth.service';
import {UserService} from '../../core/service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
    templateUrl: './timeline.layout.component.html',
})
export class TimelineLayoutComponent implements OnInit{
    user: User;
    userId: number;
    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        public translate: TranslateService) {
    }

    ngOnInit() {
        this.userId = this.route.params['id'];
        this.route.data.subscribe(data => {
            this.user = data.user;
        });
    }

}
