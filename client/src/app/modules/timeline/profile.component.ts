import {Component, OnInit} from '@angular/core';
import {User} from '../../core/model/user.model';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../core/service/user.service';
import {AuthService} from '../../core/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

declare var $: any;

@Component({
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
    editForm: FormGroup;
    user: User;

    constructor(private userService: UserService, private authService: AuthService,
                private fb: FormBuilder, public translate: TranslateService) {
        this.editForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            gender: [''],
            street: [''],
            zipCode: [''],
            city: [''],
            phone: [''],
            dob: ['']
        });
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.user = user;
            this.user.dob = moment(this.user.dob).format("YYYY-MM-DD");
            this.editForm.patchValue(user);
        });
    }

    update() {
        if (this.editForm.valid) {
            const payload = this.editForm.value;
            this.userService
                .updateProfile(payload)
                .subscribe(
                    data => {
                        this.translate.get('timeline.profile.update-success').subscribe((res: string) => {
                            alert(res);
                        });
                    },
                    err => {
                        this.translate.get('timeline.profile.system-error').subscribe((res: string) => {
                            alert(res);
                        });
                    }
                );
        } else {
            this.translate.get('timeline.profile.please-check').subscribe((res: string) => {
                alert(res);
            });
        }
    }
}
