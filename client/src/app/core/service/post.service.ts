import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Post} from '../model/post.model';

@Injectable()
export class PostService {

    constructor(private apiService: ApiService) {
    }

    newPost(text: string, notify: boolean): Observable<Post> {
        return this.apiService.post('/post', {content: text, notify});
    }

    getNewFeed(page: number): Observable<Post[]> {
        return this.apiService.get('/post/newfeed?page=' + page);
    }

    getTimeline(userId: string, page: number): Observable<Post[]> {
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
