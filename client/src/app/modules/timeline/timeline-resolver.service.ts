import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {User} from '../../core/model/user.model';
import {Observable} from 'rxjs';
import {UserService} from '../../core/service/user.service';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class TimelineResolver implements Resolve<User> {

    constructor(private userService: UserService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
        const userId = route.params['id'];
        return this.userService.getUserById(userId).pipe(map(result => {
          return result.data
        }));
    }
}
