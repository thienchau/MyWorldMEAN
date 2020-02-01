import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AdsComponent } from '../modules/ads/ads.component';
import { TranslateModule } from '@ngx-translate/core';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {LayoutComponent} from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    AdsComponent,
    AdsComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AdsComponent,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    AdsComponent,
  ]
})
export class SharedModule {
}
