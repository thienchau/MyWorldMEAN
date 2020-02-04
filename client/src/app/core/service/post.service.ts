import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Post} from '../model/post.model';

@Injectable()
export class PostService {

    constructor(private apiService: ApiService) {
    }

    newPost(payload): Observable<any> {
        return this.apiService.uploadFile('/post', payload);
    }

    getNewFeed(page: number): Observable<any> {
        return this.apiService.get('/post/newfeed?pagesize=5&page=' + page);
    }

    getTimeline(userId: string, page: number): Observable<any> {
        return this.apiService.get('/post/timeline/' + userId + '?page=' + page);
    }

    searchPosts(key: string): Observable<any> {
        return this.apiService.get('/post/search/' + key);
    }

    comment(comment): Observable<any> {
        return this.apiService.post('/post/comment', comment);
    }

    like(postId: string): Observable<any> {
        return this.apiService.post('/post/like/' + postId);
    }

    unlike(postId: string): Observable<any> {
        return this.apiService.post('/post/unlike/' + postId);
    }

    getPostDetail(postId: string): Observable<Post> {
        return this.apiService.get('/post/' + postId);
    }

    uploadMedia(payload): Observable<any> {
        return this.apiService.uploadFile('/post/uploadImage', payload);
    }

}
