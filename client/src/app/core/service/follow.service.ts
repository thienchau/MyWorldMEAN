import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';

@Injectable()
export class FollowService {

    constructor(private apiService: ApiService) {
    }

    getFollowers(): Observable<any[]> {
        return this.apiService.get('/users/follower');
    }

    getFollowing(): Observable<any[]> {
        return this.apiService.get('/users/following');
    }

    follow(userId): Observable<any> {
        return this.apiService.post('/users/follow/' + userId);
    }

    unFollow(userId): Observable<any> {
        return this.apiService.post('/users/unFollow/' + userId);
    }
}
