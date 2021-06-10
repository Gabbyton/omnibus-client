import { EventEmitter, Injectable } from '@angular/core';
import { concat, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { RouteService } from '../data/model-services/route.service';
import { SegmentService } from '../data/model-services/segment.service';
import { StopService } from '../data/model-services/stop.service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private routeService: RouteService,
    private stopService: StopService,
    private segmentService: SegmentService,
  ) { }

  prefetchMapData(): Observable<void> {
    return this.routeService.prefetch().pipe(
      concatMap(_ => this.stopService.prefetch()),
      concatMap(_ => this.segmentService.prefetch(this.routeService.getAllRoutes())),
      concatMap(_ => of(null)),
    );
  }
}