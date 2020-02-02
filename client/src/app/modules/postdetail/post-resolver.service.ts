import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Post} from '../../core/model/post.model';
import {Observable} from 'rxjs';
import {PostService} from '../../core/service/post.service';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class PostResolver implements Resolve<Post> {

    constructor(private postService: PostService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ,
    ): Observable<any> {
        const postId = route.params['id'];
        return this.postService.getPostDetail(postId).pipe(map(data => data));
    }
}
