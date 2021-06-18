import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, filter, first, map, tap } from "rxjs/operators";
import { Vehicle } from "../models/vehicle";
import { VehicleMarker } from "../models/vehicle-marker.model";
import { TranslocService } from "../web-services/transloc.service";
import { RouteService } from "./route.service";

@Injectable({
    providedIn: 'root',
})
export class BusService {
    private vehicles: Vehicle[]; // saves the vehicles as Vehicle object present in persistent vehicle data
    private persistentVehicleData: Map<number, any> = new Map(); // maps the vehicle by id to vehicle marker data

    constructor(
        private transloc: TranslocService,
        private routeService: RouteService,
    ) { }

    private getCurrentBusPositions(): Observable<Vehicle[]> {
        return this.transloc.getAllArrivalData().pipe(
            first(),
            catchError(_ => []),
            map(busArray => {
                return busArray
                    .filter((bus: Vehicle) => this.routeService.activeRoutes.includes(bus.route_id))
            }),
            tap(data => { this.vehicles = data }),
        );
    }

    private createBusesToDisplay(): Observable<any> {
        return this.getCurrentBusPositions().pipe(
            tap(_ => this.persistentVehicleData.clear()), // initially clear map of buses
            map(data => {
                data.map(bus => {
                    const busJSON = new VehicleMarker(bus.position, bus.call_name, this.routeService.getRouteColor(bus.route_id), bus.id)
                        .toJSON();
                    this.persistentVehicleData.set(bus.id, busJSON); // save data to a map of buses
                });
                return this.persistentVehicleData; // return the map of buses to display
            }));
    }

    getBusesToDisplay(changeRoute?: boolean): Observable<any> {
        changeRoute = changeRoute ?? false;
        if (this.vehicles == null || changeRoute) { // determine whether the bus map should be created or reset
            return this.createBusesToDisplay();
        } else {
            return this.getCurrentBusPositions().pipe(
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