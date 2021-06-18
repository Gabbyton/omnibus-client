import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { TranslocService } from "../web-services/transloc.service";
import { Route } from "../models/route.model";

const INITIAL_ROUTE_ID = 8004946;
const defaultActiveRoutes = [];
@Injectable({
    providedIn: 'root',
})
export class RouteService {
    private routes: Map<number, Route> = new Map();
    private activeRouteIds: number[] = defaultActiveRoutes;
    private currentRouteID: BehaviorSubject<number> = new BehaviorSubject(INITIAL_ROUTE_ID);

    activeRoutesChanged: EventEmitter<void> = new EventEmitter();

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

    get currentRouteIDObs(): BehaviorSubject<number> {
        return this.currentRouteID;
    }

    get currentRouteIDValue(): number {
        return this.currentRouteID.value;
    }

    getRoute(routeID: number): Route {
        return this.routes.get(routeID);
    }

    getRouteColor(routeID: number): string {
        return this.routes.get(routeID).color;
    }

    get activeRoutes(): number[] {
        return this.activeRouteIds;
    }

    getAllRoutes(): Route[] {
        return <Route[]>Array.from(this.routes.values());
    }

    setCurrentRoute(newCurrentRouteID: number): void {
        return this.currentRouteID.next(newCurrentRouteID);
    }

    addToActiveRoute(routeId: number): void {
        this.activeRouteIds.push(routeId);
        this.activeRoutesChanged.emit();
    }

    removeFromActiveRoute(routeId: number): void {
        const removeIndex = this.activeRouteIds.indexOf(routeId);
        if (removeIndex >= 0) {
            this.activeRouteIds.splice(removeIndex, 1);
            this.activeRoutesChanged.emit();
        }
        else
            console.error(`the route id specified is not in the array of active routes`);
    }
}