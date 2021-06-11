import { Component, OnInit } from '@angular/core';
import { SplashService } from 'src/app/utils/ui-services/splash.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  showSplash: boolean = true;
  constructor(private splashService: SplashService) { }

  ngOnInit(): void {
    this.splashService.showSplash.subscribe(showSplash => {
      this.showSplash = showSplash;
    });
  }

}
