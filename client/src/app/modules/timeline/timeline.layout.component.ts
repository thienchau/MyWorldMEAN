import {Component, OnInit} from '@angular/core';
import {User} from '../../core/model/user.model';
import {AuthService} from '../../core/service/auth.service';
import {UserService} from '../../core/service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {DataService} from '../../core/service/data.service';

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
        private dataService: DataService,
        private route: ActivatedRoute,
        public translate: TranslateService) {
    }

    ngOnInit() {
        this.userId = this.route.params['id'];
        this.route.data.subscribe(data => {
            this.user = data.user;
        });
        this.dataService.currentUser.subscribe(userInfo => {
          this.user.firstName = userInfo.firstName ? userInfo.firstName : this.user.firstName;
          this.user.lastName = userInfo.lastName ? userInfo.lastName : this.user.lastName;
          this.user.gender = userInfo.gender ? userInfo.gender : this.user.gender;
          this.user.street = userInfo.street ? userInfo.street : this.user.street;
          this.user.zipCode = userInfo.zipCode ? userInfo.zipCode : this.user.zipCode;
          this.user.city = userInfo.city ? userInfo.city : this.user.city;
          this.user.phone = userInfo.phone ? userInfo.phone : this.user.phone;
          this.user.dob = userInfo.dob ? userInfo.dob : this.user.dob;
        });
    }

}
