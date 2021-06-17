import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { RouteService } from 'src/app/utils/data/model-services/route.service';
import { StopService } from 'src/app/utils/data/model-services/stop.service';
import { Route } from 'src/app/utils/data/models/route.model';
import { Stop } from 'src/app/utils/data/models/stop.model';

@Component({
  selector: 'app-routes-list',
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoutesListComponent implements OnInit {
  @Output('OnHomeButtonClicked') onHomeButtonClicked = new EventEmitter<void>();
  stopsForEachRoute: Map<Route, Stop[]> = new Map();
  constructor(
    private routeService: RouteService,
    private stopService: StopService,
  ) { }

  ngOnInit(): void {
    // subscribe to current route changes to set the routes stops along current route
    this.getRouteStopNamesList();
  }

  getRouteStopNamesList(): void {
    const routes = this.routeService.getAllRoutes();
    for (let index = 0; index < routes.length; index++) {
      const route: Route = routes[index];
      let stops = [];
      var stopsAlongRoute = this.routeService.getRoute(parseInt(route.route_id)).stops;
      stopsAlongRoute.forEach(stopId => {
        stops.push(this.stopService.getStop(stopId));
      });
      this.stopsForEachRoute.set(route, stops);
    }
  }

  homeButtonClicked(): void {
    this.onHomeButtonClicked.emit();
  }

}
