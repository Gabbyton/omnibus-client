import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/utils/models/route';
import { TranslocService } from 'src/app/utils/transloc.service';

@Component({
  selector: 'app-route-select',
  templateUrl: './route-select.component.html',
  styleUrls: ['./route-select.component.css']
})
export class RouteSelectComponent implements OnInit {
  
  displayRoutes: Route[];

  constructor(private translocService: TranslocService) { }

  ngOnInit(): void {
    this.displayRoutes = [];
    this.translocService.allRoutes.subscribe(allRoutes => {
      this.displayRoutes = allRoutes;
    });
  }

  selectRoute(newRouteId: string) {
    this.translocService.setGlobalCurrentRouteNumber(parseInt(newRouteId));
    const routeName: string = this.displayRoutes.filter(route => route.route_id == newRouteId)[0].short_name;
    this.translocService.setGlobalCurrentRouteName(routeName);
  }

}