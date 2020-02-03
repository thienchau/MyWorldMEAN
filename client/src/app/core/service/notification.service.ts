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

    getNotifications(): Observable<any> {
        return this.apiService.get('/notifications');
    }

    markAllRead(): Observable<any> {
        return this.apiService.get('/notifications/markAllAsRead');
    }

    mark1Read(id): Observable<any> {
        return this.apiService.get('/notifications/markAsRead/' + id);
    }
}
