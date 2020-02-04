import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../core/service/auth.service';
import {User} from '../../core/model/user.model';

declare var $: any;


@Component({
    selector: 'app-shortcut',
    templateUrl: './shortcut.component.html',
})
export class ShortcutComponent implements OnInit, OnDestroy {

    user: User;

    constructor(private router: Router,
                private authService: AuthService,
    ) {
    }


    logout() {
        this.authService.purgeAuth();
        this.router.navigateByUrl('/login');
    }

    ngOnDestroy() {
    }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            this.user = user;
        });
    }

    navigateToUrl(url: string) {
        this.router.navigateByUrl(url);
    }


}
