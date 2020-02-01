import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Advertisement } from '../model/ads.model';


@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private apiService: ApiService) { }

  getAdvertisements(): Observable<Advertisement[]> {
    return this.apiService.get('/advertisements');
  }
}
