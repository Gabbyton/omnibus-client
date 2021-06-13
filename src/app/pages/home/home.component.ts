import { Component, OnInit } from '@angular/core';
import { SplashService } from 'src/app/utils/ui-services/splash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRouteName: string;
  items = [
    "Walmart",
    "Library",
    "Gallery"
  ];

  constructor(private splashService: SplashService) { }
  isUserOpen: boolean = false;

  ngOnInit(): void {
    this.splashService.hide();
  }

  toggleUserView(isUserOpen: boolean) {
    this.isUserOpen = isUserOpen;
  }
}
