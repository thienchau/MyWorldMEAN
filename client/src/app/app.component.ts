import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/service/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'myWorld';

  constructor(private authService: AuthService, public translate: TranslateService) {
    this.initLang(translate);
  }

  ngOnInit(): void {
    this.authService.populate();
  }

  initLang(translate) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
  }
}

