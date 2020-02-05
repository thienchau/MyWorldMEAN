import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../core/model/user.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../core/service/user.service';
import { NotificationService } from './../../core/service/notification.service';
import { PostNotification } from './../../core/model/postNotification.model';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  notifications: Array<any> = [];
  currentUser: User;
  currentLang: string;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
    private notificationService: NotificationService,
  ) {
    this.searchForm = this.fb.group({
      searchKey: ['']
    });
    this.notifications = [];
  }


  ngOnDestroy() {
  }

  ngOnInit() {
    this.headerAnimation();
    this.authService.currentUser.subscribe(user => {
      console.log(user);

      this.currentUser = user;
      this.useLangugage(user.lang != null ? user.lang : 'en');
    });
    this.loadNotifications();
  }

  logout() {
    this.authService.purgeAuth();
    this.router.navigateByUrl('/login');
  }

  headerAnimation() {
    //------- Notifications Dropdowns
    $('.top-area > .setting-area > li > a').on('click', function () {
      var $parent = $(this).parent('li');
      $parent.siblings().children('div').removeClass('active');
      $(this).siblings('div').addClass('active');
      return false;
    });


    //------- remove class active on body
    $('body *').not('.top-area > .setting-area > li > a').on('click', function () {
      $('.top-area > .setting-area > li > div').not('.searched').removeClass('active');

    });
    $('.user-img').on('click', function () {
      $('.user-setting').toggleClass('active');
    });

    // Sticky Sidebar & header
    if ($(window).width() < 769) {
      $('.sidebar').children().removeClass('stick-widget');
    }

    if ($.isFunction($.fn.stick_in_parent)) {
      $('.stick-widget').stick_in_parent({
        parent: '#page-contents',
        offset_top: 60,
      });


      $('.stick').stick_in_parent({
        parent: 'body',
        offset_top: 0,
      });

    }
  }

  countTime(date: string): string {
    const postTime = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');
    moment.locale(this.currentLang);
    return postTime.fromNow();
  }

  search() {
    const value = this.searchForm.get('searchKey').value;
    this.router.navigateByUrl('/search/' + value).then(() => {
      window.location.reload();
    });
  }

  gotoTimeline() {
    this.router.navigateByUrl('/timeline/' + this.currentUser._id);
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(
        data => {
            this.notifications = data.data.notification;
        }, error => {
        });
  }

  clickNotification(notification: PostNotification) {
    this.notificationService.mark1Read(notification._id).subscribe(data => {
        this.loadNotifications();
        this.router.navigateByUrl('/post/' + notification.url);
    }, error => {

    });
  }

  markAllRead() {
    this.notificationService.markAllRead().subscribe(data => {
      this.loadNotifications();
    }, error => {
    });
  }

  useLangugage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    this.currentUser.lang = lang;
    this.userService.updateLang(lang).subscribe(data => {
      console.log('updated lang');
    }, error => {
      console.log('updated lang failed');
    });
  }
}
