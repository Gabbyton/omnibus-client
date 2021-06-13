import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/utils/data/model-services/route.service';
import { StopService } from 'src/app/utils/data/model-services/stop.service';
import { Stop } from 'src/app/utils/data/models/stop.model';
import { SplashService } from 'src/app/utils/ui-services/splash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRouteName: string;
  displayStops: Stop[] = [];

  constructor(
    private splashService: SplashService,
    private routeService: RouteService,
    private stopService: StopService,
  ) { }
  isUserOpen: boolean = false;

  ngOnInit(): void {
    this.splashService.hide();
    this.getRouteStopNamesList();
  }

  toggleUserView(isUserOpen: boolean) {
    this.isUserOpen = isUserOpen;
  }

  getRouteStopNamesList() {
    this.routeService.currentRouteIDSubject.subscribe(routeId => {
      this.displayStops = [];
      var stopsAlongRoute = this.routeService.getRoute(routeId).stops;
      stopsAlongRoute.forEach(stopId => {
        this.displayStops.push(this.stopService.getStop(stopId));
      });
    });
  }

  get displayStopsLength() {
    return this.displayStops.length;
  }
}
