import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { LiveLocationService } from "../../live-location.service";
import { Vehicle } from "../models/vehicle";
import { VehicleMarker } from "../models/vehicle-marker.model";

@Injectable({
    providedIn: 'root',
})
export class BusService {
    private vehicles: Vehicle[];
    private persistentVehicleData: Map<number, any> = new Map();

    constructor(private livelocation: LiveLocationService) { }

    private getCurrentBusPositions(routeId: number): Observable<Vehicle[]> {
        return this.livelocation.getArrivalData(routeId).pipe(
            first(),
            catchError(_ => []),
            tap(data => { this.vehicles = data }),
        );
    }

    private createBusesToDisplay(routeId: number): Observable<any> {
        return this.getCurrentBusPositions(routeId).pipe(
            tap(_ => this.persistentVehicleData.clear()), // initially clear map of buses
            map(data => {
                data.map(bus => {
                    const busJSON = new VehicleMarker(bus.position, bus.call_name, bus.id)
                        .toJSON();
                    this.persistentVehicleData.set(bus.id, busJSON); // save data to a map of buses
                });
                return this.persistentVehicleData; // return the map of buses to display
            }));
    }

    getBusesToDisplay(routeId: number, changeRoute?: boolean): Observable<any> {
        if (this.vehicles == null || (changeRoute ?? false)) { // determine whether the bus map should be created or reset
            return this.createBusesToDisplay(routeId);
        } else {
            return this.getCurrentBusPositions(routeId).pipe(
                map(data => {
                    data.forEach(bus => {
                        this.persistentVehicleData.get(bus.id).position =
                            new google.maps.LatLng(bus.position[0], bus.position[1]); // avoid redrawing marker by updating marker position instead
                    });
                    return this.persistentVehicleData;
                })
            )
        }
    }

}