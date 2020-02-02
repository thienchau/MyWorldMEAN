import { Component, OnInit } from '@angular/core';
import { AdvertisementService } from '../../core/service/ads.service';
import { Advertisement } from '../../core/model/ads.model';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  advertisements: Array<Advertisement> = [];

  constructor(private adsService: AdvertisementService) { }

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.adsService.getAdvertisements().subscribe(
        data => {
            this.advertisements = data;
        }, error => {
            // show error
        });
  }
}
