import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { TranslocService } from '../../transloc.service';
import { StopMarker } from '../models/stop-marker.model';
import { Stop } from '../models/stop.model';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class StopService {
    private stops: Stop[];

    constructor(private transloc: TranslocService, private utils: UtilsService) { }

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
            .map(stop => new StopMarker(stop.location, stop.name).toJSON());
    }
}
