import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { TranslocService } from "../../transloc.service";
import { Route } from "../models/route.model";

const INITIAL_ROUTE_ID = 8004946;

@Injectable({
    providedIn: 'root',
})
export class RouteService {
    private routes: Map<number, Route> = new Map();
    currentRouteID: BehaviorSubject<number> = new BehaviorSubject(INITIAL_ROUTE_ID);

    constructor(private transloc: TranslocService) { }

    prefetch(): Observable<boolean> {
        return this.transloc.getRoutes().pipe(
            tap(data => {
                data.forEach(route => {
                    this.routes.set(parseInt(route.route_id), route);
                });
            }),
            concatMap(_ => of(true)),
            catchError(_ => of(false)),
        );
    }

    getRoute(routeID: number): Route {
        return this.routes.get(routeID);
    }


    getAllRoutes(): Route[] {
        return Array.from(this.routes.values());
    }

    setCurrentRoute(newCurrentRouteID: number) {
        return this.currentRouteID.next(newCurrentRouteID);
    }
}