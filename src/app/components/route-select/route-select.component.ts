import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/utils/data/models/route.model';
import { RouteService } from 'src/app/utils/data/model-services/route.service';
import { TranslocService } from 'src/app/utils/data/web-services/transloc.service';
import { UiService } from 'src/app/utils/ui-services/ui.service';

@Component({
  selector: 'app-route-select',
  templateUrl: './route-select.component.html',
  styleUrls: ['./route-select.component.scss']
})
export class RouteSelectComponent implements OnInit {

  displayRoutes: Route[];

  constructor(
    private translocService: TranslocService,
    private routeService: RouteService,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
    this.displayRoutes = [];
    // this.translocService.allRoutes.subscribe(allRoutes => {
    //   this.displayRoutes = allRoutes;
    // });
    // this.displayRoutes = this.routeService.getAllRoutes();
  }

  // selectRoute(newRouteId: string) {
  //   this.translocService.setGlobalCurrentRouteNumber(parseInt(newRouteId));
  //   const routeName: string = this.displayRoutes.filter(route => route.route_id == newRouteId)[0].short_name;
  //   this.translocService.setGlobalCurrentRouteName(routeName);
  //   this.uiService.toggleDrawer();
  // }
}
