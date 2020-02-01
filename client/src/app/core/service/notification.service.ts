import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {PostNotification} from '../model/postNotification.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    constructor(private apiService: ApiService) {
    }

    getNotifications(): Observable<PostNotification[]> {
        return this.apiService.get('/notification/getNotifications');
    }

    markAllRead(): Observable<any> {
        return this.apiService.post('/notification/markAllRead');
    }

    mark1Read(id): Observable<any> {
        return this.apiService.post('/notification/markRead/' + id);
    }
}
