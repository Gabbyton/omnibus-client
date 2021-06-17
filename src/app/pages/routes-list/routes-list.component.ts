import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouteService } from 'src/app/utils/data/model-services/route.service';
import { StopService } from 'src/app/utils/data/model-services/stop.service';
import { Stop } from 'src/app/utils/data/models/stop.model';

@Component({
  selector: 'app-routes-list',
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss']
})
export class RoutesListComponent implements OnInit {
  @Output('OnHomeButtonClicked') onHomeButtonClicked = new EventEmitter<void>();
  displayStops: Stop[] = [];
  constructor(
    private routeService: RouteService,
    private stopService: StopService,
  ) { }

  ngOnInit(): void {
    // subscribe to current route changes to set the routes stops along current route
    this.getRouteStopNamesList();
  }

  getRouteStopNamesList(): void {
    this.routeService.currentRouteIDSubject.subscribe(routeId => {
      this.displayStops = [];
      var stopsAlongRoute = this.routeService.getRoute(routeId).stops;
      stopsAlongRoute.forEach(stopId => {
        this.displayStops.push(this.stopService.getStop(stopId));
      });
    });
  }

  get displayStopsLength(): number {
    return this.displayStops.length;
  }

  homeButtonClicked(): void {
    this.onHomeButtonClicked.emit();
  }

}
