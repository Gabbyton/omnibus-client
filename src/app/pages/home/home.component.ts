import { Component, OnInit, ViewChild } from '@angular/core';
import { SplashService } from 'src/app/utils/ui-services/splash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRouteName: string;

  constructor(private splashService: SplashService) { }

  ngOnInit(): void {
    this.splashService.hide();
  }

}
