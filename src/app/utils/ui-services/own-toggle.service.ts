import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { RouteService } from '../data/model-services/route.service';
import { SocketService } from '../data/web-services/socket.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class OwnToggleService {

  constructor(
    private socketService: SocketService,
    private routeService: RouteService,
  ) { }

  // TODO: get current stop
  // TODO: create a stop service for getting the nearest stpo
  private getStopId() {
    // TODO: replace with stop id
    return 0;
  }

  // TODO: error handling on server down while show location is on
  toggleShowLocation(currentlyShowingLocation: boolean) {
    if (currentlyShowingLocation == true) {
      // turn off show location
      this.socketService.onRouteExited().pipe(
        first(),
      ).subscribe(exitData => {
        // TODO: remove
        console.log(exitData);
      });
      this.socketService.routeUnsubscribeAll();
    } else {
      this.socketService.routeSubscribe(this.routeService.currentRouteIDValue, this.getStopId());
      this.socketService.onRouteJoined().pipe(
        first(),
      ).subscribe(joinData => {
        // additional on route join operations here
        // TODO: remove
        console.log(joinData);
      });
    }
  }
}
