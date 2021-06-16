import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { TranslocService } from '../web-services/transloc.service';
import { StopMarker } from '../models/stop-marker.model';
import { Stop } from '../models/stop.model';
import { RouteService } from './route.service';

@Injectable({
    providedIn: 'root'
})
export class StopService {
    currentStopId: Subject<number> = new Subject();
    private stops: Stop[];

    constructor(
        private transloc: TranslocService,
        private routeService: RouteService,
    ) { }

    prefetch(): Observable<boolean> {
        return this.transloc.getStops().pipe(
            tap(values => { this.stops = values }),
            concatMap(_ => of(true)),
            catchError(_ => of(false)),
        )
    }

    getStopsToDisplay(routeId: number): any[] {
        return this.stops
            .filter(stop => stop.routes.includes(routeId.toString()))
            .map(stop => new StopMarker(stop.stop_id, stop.location, stop.name, this.routeService.getRouteColor(this.routeService.currentRouteIDValue)).toJSON());
    }

    getStop(id: string): Stop {
        return this.stops.filter(stop => stop.stop_id == id)[0];
    }
}
