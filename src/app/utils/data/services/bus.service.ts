import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, first, map, tap } from "rxjs/operators";
import { LiveLocationService } from "../../live-location.service";
import { Vehicle } from "../models/vehicle";
import { VehicleMarker } from "../models/vehicle-marker.model";

@Injectable({
    providedIn: 'root',
})
export class BusService {
    private vehicles: Vehicle[];

    constructor(private livelocation: LiveLocationService) { }

    getCurrentBusPositions(routeId: number): Observable<Vehicle[]> {
        return this.livelocation.getArrivalData(routeId).pipe(
            first(),
            catchError(_ => []),
            tap(data => { this.vehicles = data }),
        );
    }

    getBusesToDisplay(routeId: number): Observable<any[]> {
        return this.getCurrentBusPositions(routeId).pipe(
            map(data =>
                data.map(bus =>
                    new VehicleMarker(bus.position, bus.call_name, bus.id)
                        .toJSON())),
        )
    }

}