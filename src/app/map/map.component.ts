import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from '../utils/transloc.service';
import { of, timer } from "rxjs";
import { concatMap, tap, map, filter, take } from "rxjs/operators";
import { Marker } from '../utils/models/marker';
import { Stop } from '../utils/models/stop';
import { Vehicle } from '../utils/models/vehicle';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  markers: Marker[];
  displayMarkers: any[];
  stops: Stop[];
  verticesSet: any[];
  displayBuses: any[];

  currentRoute: string;
  isLoading: boolean;

  zoom = 16;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  }

  constructor(private transloc: TranslocService) { }

  ngOnInit() {
    this.currentRoute = "8004958";
    this.markers = [];
    this.displayMarkers = [];
    this.stops = [];
    this.verticesSet = [];
    this.isLoading = false;
    this.displayBuses = [];
    this.initMap();
  }

  updateMarkers(): void {
    this.displayMarkers = [];
    this.markers = [];
    const finalStops = this.stops.filter(stop => stop.routes.indexOf(this.currentRoute) > -1);
    for (let stop of finalStops)
      this.markers.push(new Marker(stop.location, 'red', stop.name, stop.name));
    this.displayMarkers = this.markers.map(marker => marker.getMarkerMapsObject());
  }

  updateRoutes(): void { // FIXME: store all routes in memory/cache for quick loading
    this.transloc.getSegmentsForRoute(this.currentRoute).subscribe((encRoutes: string[]) => {
      this.verticesSet = [];
      encRoutes.forEach(encRoute => {
        this.verticesSet.push(google.maps.geometry.encoding.decodePath(encRoute));
      })
    });
  }

  zoomIn(): void {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut(): void {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

  initMap(): void {
    this.isLoading = true;
    const startupSeq = of(2);
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      startupSeq.pipe(
        concatMap(_ => {
          return this.transloc.getSegmentsForRoute(this.currentRoute);
        }),
        tap((encRoute: string[]) => {
          encRoute.forEach(encRoute => { // TODO: convert to forkJoin and assign only on subscription
            this.verticesSet.push(google.maps.geometry.encoding.decodePath(encRoute));
          });
        }),
        concatMap(_ => {
          return this.transloc.getStops();
        }),
      ).subscribe((stopData: any) => {
        for (let element of stopData) {
          this.stops.push(element);
        }
        this.updateMarkers();
        this.isLoading = false;
        this.getCurrentBusPositions().subscribe(_ => {});
      });
    });
  }

  changeRoute(newRoute: string): void {
    this.currentRoute = newRoute;
    this.updateMarkers();
    this.updateRoutes();
  }

  getCurrentBusPositions() {
    return timer(0, 500).pipe(
      concatMap(_ => {
        return this.transloc.getArrivalData().pipe(
          map((busArray: Vehicle[]) => busArray.filter(bus => bus.route_id == parseInt(this.currentRoute))),
          tap((busArray: Vehicle[]) => {
            const busIds = this.displayBuses.map(bus => bus.id);
            console.log(busIds);
            busArray.forEach(bus => {
              if(busIds.indexOf( bus.id ) < 0) {
                const newDisplayBus = new Marker(bus.position, 'red', bus.call_name, bus.call_name, '',bus.id).getMarkerMapsObject();
                console.log(newDisplayBus);
                this.displayBuses.push(newDisplayBus);
              }
              else { // TODO: replace array with hashmap, figure out how to update the display
                const replaceBus = this.displayBuses.filter(currentBus => currentBus.id == bus.id)[0];
                console.log(replaceBus);
                replaceBus.position.lat = bus.position[0];
                replaceBus.position.lng = bus.position[1];
              }
            });
          }),
          take(1)
        );
      }),
    )
  }

  // TODO: add angular animations to expand button
}
