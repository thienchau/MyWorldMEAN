import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';

@Injectable()
export class FollowService {

    constructor(private apiService: ApiService) {
    }

    getFollowers(): Observable<any> {
        return this.apiService.get('/user/follower');
    }

    getFollowing(): Observable<any> {
        return this.apiService.get('/user/following');
    }

    follow(userId): Observable<any> {
        return this.apiService.post('/user/follow/' + userId);
    }

    unFollow(userId): Observable<any> {
        return this.apiService.post('/user/unFollow/' + userId);
    }
}
