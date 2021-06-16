import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { RouteService } from '../data/model-services/route.service';
import { SegmentService } from '../data/model-services/segment.service';
import { StopService } from '../data/model-services/stop.service';

const initToggleButtonState = true;

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private disableToggle: BehaviorSubject<boolean> = new BehaviorSubject(initToggleButtonState);

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


  get disableToggleObs(): BehaviorSubject<boolean> {
    return this.disableToggle;
  }

  setDisableToggle(disable: boolean) {
    this.disableToggle.next(disable);
  }
}