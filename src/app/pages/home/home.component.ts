import { Component, OnInit, ViewChild } from '@angular/core';
import { SplashService } from 'src/app/utils/ui-services/splash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentRouteName: string;
  toggleButtons = [
    { icon: 'favorite' },
    { icon: 'own-toggle' },
    { icon: 'bus-toggle' },
    { icon: 'group-toggle' },
    { icon: 'pool-toggle' },
  ]

  constructor(
    private splashService: SplashService) {
  }

  ngOnInit(): void {
    this.splashService.hide();
  }

}
