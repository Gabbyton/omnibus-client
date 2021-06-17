import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { RouteService } from '../data/model-services/route.service';
import { StopService } from '../data/model-services/stop.service';
import { SocketService } from '../data/web-services/socket.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class OwnToggleService {

  constructor(
    private socketService: SocketService,
    private routeService: RouteService,
    private stopService: StopService,
  ) { }

  private getStopId() {
    return this.stopService.currentStopIdValue;
  }

  // TODO: error handling on server down while show location is on
  toggleShowLocation(currentlyShowingLocation: boolean) {
    if (currentlyShowingLocation == true) {
      // turn off show location
      this.socketService.routeUnsubscribeAll();
    } else {
      this.socketService.routeSubscribe(this.routeService.currentRouteIDValue, this.getStopId());
    }
  }
}
