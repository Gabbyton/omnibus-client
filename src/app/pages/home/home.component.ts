import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/utils/data/model-services/route.service';
import { StopService } from 'src/app/utils/data/model-services/stop.service';
import { Stop } from 'src/app/utils/data/models/stop.model';
import { SocketService } from 'src/app/utils/data/web-services/socket.service';
import { SplashService } from 'src/app/utils/ui-services/splash.service';
import { UiService } from 'src/app/utils/ui-services/ui.service';
import { ToastrService } from 'ngx-toastr';

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
    private socketService: SocketService,
    private uiService: UiService,
    private toastr: ToastrService,
  ) { }
  isUserOpen: boolean = false;

  ngOnInit(): void {
    // hide splash page when home screen is done loading
    this.splashService.hide();
    // subscribe to current route changes to set the routes stops along current route
    this.getRouteStopNamesList();
    // listen to error events for the socket service and disable home page ui accordingly
    this.socketService.onConnectError().subscribe(err => {
      this.uiService.setDisableToggle(true);
    });
    this.socketService.onConnect().subscribe(_ => {
      this.uiService.setDisableToggle(false);
      // this.toastr.success('Hello world!', 'Toastr fun!');
    });
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
