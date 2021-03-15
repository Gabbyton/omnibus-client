import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
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

  displayBuses: number[];
  busMap: Map<number, any>;

  bottomPanelHeight: number;
  DEFAULT_BOTTOM_PANEL_HEIGHT: number;
  EXPANDED_BOTTOM_PANEL_HEIGHT: number;

  currentRoute: string;
  isLoading: boolean;

  zoom = 16;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 18,
    minZoom: 8,
  }

  constructor(private transloc: TranslocService) { }

  ngOnInit() {
    // set default parameters
    this.currentRoute = "8004946"; // TODO: change in settings, store in local storage
    this.DEFAULT_BOTTOM_PANEL_HEIGHT = 25;
    this.EXPANDED_BOTTOM_PANEL_HEIGHT = 50;

    // initialize dynamic variables
    this.isLoading = false;

    this.markers = [];
    this.displayMarkers = [];

    this.stops = [];
    this.verticesSet = [];

    this.displayBuses = [];
    this.busMap = new Map();

    this.bottomPanelHeight = this.DEFAULT_BOTTOM_PANEL_HEIGHT;
    this.initMap();
  }

  expandBottomPanel(): void {
    if(this.bottomPanelHeight != this.DEFAULT_BOTTOM_PANEL_HEIGHT)
      this.bottomPanelHeight = this.DEFAULT_BOTTOM_PANEL_HEIGHT;
    else
      this.bottomPanelHeight = this.EXPANDED_BOTTOM_PANEL_HEIGHT;
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
        this.getCurrentBusPositions().subscribe(_ => { });
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
            busArray.forEach(bus => {
              if (this.displayBuses.indexOf(bus.id) < 0) {
                const newDisplayBus = new Marker(bus.position, 'red', bus.call_name, bus.call_name, '', bus.id, 'vehicle').getMarkerMapsObject();
                this.displayBuses.push(bus.id);
                this.busMap.set(bus.id, newDisplayBus);
              }
              else { // FIXME: marker position not updating
                const replaceBus = this.busMap.get(bus.id);
                replaceBus.position = new google.maps.LatLng(bus.position[0], bus.position[1]);
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
