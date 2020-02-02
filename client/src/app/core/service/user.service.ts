import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  constructor(private apiService: ApiService) {
  }

  register(user: FormData): Observable<any> {
    return this.apiService.post('/user/register', user).pipe(data => data);
  }

  getUserById(userId: number): Observable<any> {
    return this.apiService.get('/user/' + userId);
  }

  search(key): Observable<any> {
    return this.apiService.get('/user/search/' + key);
  }

  uploadAvatar(image: FormData): Observable<any> {
    return this.apiService.uploadFile('/user/uploadAvatar', image);
  }

  updateProfile(user: FormData): Observable<any> {
    return this.apiService.post('/user/update', user);
  }

  getLang(): Observable<string> {
    return this.apiService.get('/user/getLang');
  }

  updateLang(lang: string): Observable<any> {
    return this.apiService.post('/user/lang/' + lang);
  }
}
