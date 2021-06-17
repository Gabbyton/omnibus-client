import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/utils/data/web-services/socket.service';
import { SplashService } from 'src/app/utils/ui-services/splash.service';
import { UiService } from 'src/app/utils/ui-services/ui.service';
import { StopService } from 'src/app/utils/data/model-services/stop.service';
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUserOpen: boolean = false;
  isRouteOpen: boolean = false;
  currentStopName: string = null;
  currentStopColor: string = null;

  constructor(
    private stopService: StopService,
    private splashService: SplashService,
    private socketService: SocketService,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
    // hide splash page when home screen is done loading
    this.splashService.hide();
    // listen to error events for the socket service and disable home page ui accordingly
    combineLatest([this.socketService.onConnect(), this.stopService.currentStopObs]).pipe(
      filter(data => data[1] != null),
    ).subscribe(_ => {
      this.uiService.setDisableToggle(false);
    });
    this.socketService.onConnectError().subscribe(err => {
      this.uiService.setDisableToggle(true);
    });
    // change stop name displayed when selecting new stop
    this.stopService.currentStopObs.pipe(
      filter(stop => stop != null),
    ).subscribe(newStopName => {
      const newStop = this.stopService.getStop(`${newStopName}`);
      this.currentStopName = newStop.name;
      this.socketService.routeUnsubscribeAll();
    });
    this.socketService.onRouteExited().pipe(
    ).subscribe(exitData => {
      // TODO: remove
      console.log(exitData);
    });
    this.socketService.onRouteJoined().pipe(
    ).subscribe(joinData => {
      // additional on route join operations here
      // TODO: remove
      console.log(joinData);
    });
  }

  toggleUserView(isUserOpen: boolean) {
    this.isUserOpen = isUserOpen;
  }

  toggleRoutesView(isRouteOpen: boolean) {
    this.isRouteOpen = isRouteOpen;
  }
}
