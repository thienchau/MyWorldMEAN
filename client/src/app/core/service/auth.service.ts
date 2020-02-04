import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { User } from '../model/user.model';


@Injectable()
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private http: HttpClient
  ) {
  }

  login(credentials): Observable<any> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    // params.append('grant_type', 'password');
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa('client:my-secret-key')
    };
    return this.http.post<{ data: { user: any, access_token: any } }>(environment.api_url + '/user/login', params.toString(), { headers })
      .pipe(map(
        data => {
          this.setAuth(data.data.access_token);
          this.setUserInfo(data.data.user);
          return data;
        }
      ));
  }

  setAuth(token) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(token);
  }

  setUserInfo(user) {
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  getUserInfo(): Observable<any> {
    return this.apiService.get('/user/info');
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.isAuthenticatedSubject.next(true);
      this.getUserInfo().subscribe(data => {
        this.setUserInfo(data);
      }, error => {
        this.purgeAuth();
      });
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

}
