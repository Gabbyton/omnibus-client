import { Component, OnInit, ViewChild } from '@angular/core';
import { SplashService } from 'src/app/utils/ui-services/splash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRouteName: string;
  toggleButtons: { icon: string, location: string }[] = [
    { icon: 'favorite', location: null },
    { icon: 'own-toggle', location: null },
    { icon: 'bus-toggle', location: null },
    { icon: 'group-toggle', location: null },
    { icon: 'pool-toggle', location: null },
  ]

  constructor(private splashService: SplashService) { }

  ngOnInit(): void {
    this.splashService.hide();
    this.toggleButtons.forEach(element => {
      element['location'] = `assets/icons/toggle-buttons/${element.icon}.svg`;
    });
    this.toggleButtons.push({ icon: 'menu', location: 'assets/icons/menu-icons/menu.svg' });
  }

}
