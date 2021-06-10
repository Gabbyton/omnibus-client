import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { TranslocService } from "../web-services/transloc.service";
import { Route } from "../models/route.model";

@Injectable({
    providedIn: 'root'
})
export class SegmentService {
    private segments: Map<number, any[]> = new Map();

    constructor(private transloc: TranslocService) { }

    prefetch(allRoutes: Route[]): Observable<boolean> {
        return this.transloc.getSegmentsForAllRoutes(allRoutes).pipe(
            tap(data => { this.segments = data }),
            concatMap(_ => of(true)),
            catchError(_ => of(false)),
        );
    }

    getSegment(routeID: number): any[] {
        return this.segments.get(routeID);
    }
}