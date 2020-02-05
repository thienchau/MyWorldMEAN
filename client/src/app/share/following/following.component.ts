import { Component, OnInit } from '@angular/core';
import { Follow } from '../../core/model/follow.model';
import { FollowService } from '../../core/service/follow.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  followers: Array<Follow> = [];

  constructor(private followService: FollowService, private translate: TranslateService) { }

  ngOnInit() {
    this.loadFollowers();
  }

  loadFollowers() {
    this.followService.getFollowers().subscribe(
      result => {
        this.followers = result.data;
      }, error => {
      });
  }

}
