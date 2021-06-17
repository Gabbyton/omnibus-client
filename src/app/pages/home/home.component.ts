import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/utils/data/web-services/socket.service';
import { SplashService } from 'src/app/utils/ui-services/splash.service';
import { UiService } from 'src/app/utils/ui-services/ui.service';
import { ToastrService } from 'ngx-toastr';
import { StopService } from 'src/app/utils/data/model-services/stop.service';
import { filter } from 'rxjs/operators';

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
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // hide splash page when home screen is done loading
    this.splashService.hide();
    // listen to error events for the socket service and disable home page ui accordingly
    this.socketService.onConnectError().subscribe(err => {
      this.uiService.setDisableToggle(true);
    });
    this.socketService.onConnect().subscribe(_ => {
      this.uiService.setDisableToggle(false);
      // this.toastr.info('Select Stop', 'Select a stop to enable tracking', {
      //   disableTimeOut: true,
      //   closeButton: false,
      //   tapToDismiss: false,
      //   positionClass: 'inline',
      // });
    });
    // change stop name displayed when selecting new stop
    this.stopService.currentStopObs.pipe(
      filter(stop => stop != null),
    ).subscribe(newStopName => {
      const newStop = this.stopService.getStop(`${newStopName}`);
      this.currentStopName = newStop.name;
    });
  }

  toggleUserView(isUserOpen: boolean) {
    this.isUserOpen = isUserOpen;
  }

  toggleRoutesView(isRouteOpen: boolean) {
    this.isRouteOpen = isRouteOpen;
  }
}
