import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private userSource = new BehaviorSubject<any>({});
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(userInfo: any) {
    this.userSource.next(userInfo);
  }

}
