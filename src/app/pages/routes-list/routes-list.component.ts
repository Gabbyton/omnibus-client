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
  activeRouteIds: Map<number, boolean> = new Map();
  constructor(
    private routeService: RouteService,
    private stopService: StopService,
  ) { }

  ngOnInit(): void {
    this.routeService.getAllRoutes().forEach(route => {
      // assing route status in map, default is false
      const routeId = parseInt(route.route_id);
      this.activeRouteIds.set(routeId, false);
      // retrieve the names of the stops for all routes
      let stops = [];
      const stopsAlongRoute = this.routeService.getRoute(routeId).stops;
      stopsAlongRoute.forEach(stopId => {
        stops.push(this.stopService.getStop(stopId));
      });
      this.stopsForEachRoute.set(route, stops);
    });
    // set initially active routes as active for this component
    this.routeService.activeRoutes.forEach(activeRouteId => {
      this.activeRouteIds.set(activeRouteId, true);
    });
  }

  homeButtonClicked(): void {
    this.onHomeButtonClicked.emit();
  }

  toggleRouteVisibility(route: Route) {
    const routeId = parseInt(route.route_id);
    if (this.isRouteActive(route)) { // if route is active, set to inactive
      this.activeRouteIds.set(routeId, false);
      this.routeService.removeFromActiveRoute(routeId);
    } else {
      this.activeRouteIds.set(routeId, true);
      this.routeService.addToActiveRoute(routeId);
    }
  }

  isRouteActive(route: Route): boolean {
    return this.activeRouteIds.get(parseInt(route.route_id));
  }
}
