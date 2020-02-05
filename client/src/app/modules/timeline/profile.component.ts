import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../../core/model/user.model';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../core/service/user.service';
import {AuthService} from '../../core/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import {DataService} from '../../core/service/data.service';

declare var $: any;

@Component({
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
    editForm: FormGroup;
    user: User;

    constructor(private userService: UserService, private authService: AuthService,
                private fb: FormBuilder, public translate: TranslateService, private route: Router,
                private dataService: DataService) {
        this.editForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            gender: ['', Validators.required],
            street: [''],
            zipCode: ['', Validators.required],
            city: [''],
            phone: [''],
            dob: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.user = user;
            this.user.dob = moment(this.user.dob).format("YYYY-MM-DD");
            this.editForm.patchValue(user);
        });
    }

    isFieldInValidRegister(field: string) {
      return !this.editForm.get(field).valid && this.editForm.get(field).touched;
    }

    validateAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
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
                          this.authService.currentUser.pipe(map(user => {
                            user.firstName = payload.firstName;
                            user.lastName = payload.lastName;
                            user.gender = payload.gender;
                            user.street = payload.street;
                            user.zipCode = payload.zipCode;
                            user.city = payload.city;
                            user.phone = payload.phone;
                            user.dob = payload.dob;
                          })).subscribe();
                          alert(res);
                          this.dataService.changeUser(payload);
                        });
                    },
                    err => {
                        this.translate.get('timeline.profile.system-error').subscribe((res: string) => {
                        });
                    }
                );
        } else {
            this.validateAllFormFields(this.editForm);
            // this.translate.get('timeline.profile.please-check').subscribe((res: string) => {
            // });
        }
    }
}
