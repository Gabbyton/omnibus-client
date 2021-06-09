import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from '../utils/transloc.service';
import { BehaviorSubject, forkJoin, Observable, of, Subscription, timer } from "rxjs";
import { concatMap, take, tap } from "rxjs/operators";
import { Stop } from '../utils/data/models/stop.model';
import { Route } from '../utils/data/models/route';
import { LiveLocationService } from '../utils/live-location.service';
import { StopMarker } from '../utils/data/models/stop-marker.model';
import { VehicleMarker } from '../utils/data/models/vehicle-marker.model';
import { Vehicle } from '../utils/data/models/vehicle';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  // fields containing map data
  private allStops: Stop[];
  allRoutes: Route[];
  allSegments: Map<number, any[]>;
  allVehicles: BehaviorSubject<Vehicle[]>;

  // field for rendering
  displayMarkers: any[];
  drawSegmentSet: any[];

  displayBusIds: number[];
  busMap: Map<number, any>;
  busTimerSubs: Subscription;

  currentRoute: number;

  // ui fields
  prefetchLoading: boolean;
  busTimerLoading: boolean;
  mapLoading: boolean;
  onInitLoading: boolean;

  bottomPanelHeight: number;
  DEFAULT_BOTTOM_PANEL_HEIGHT: number;
  EXPANDED_BOTTOM_PANEL_HEIGHT: number;

  isLoading: boolean;

  // map fields
  mapZoom = 16;
  mapCenter: google.maps.LatLngLiteral;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 18,
    minZoom: 8,
    // gestureHandling: "cooperative" // TODO: add once testing on actual devices
  }
  segmentOptions: google.maps.PolylineOptions;

  constructor(private transloc: TranslocService, private liveLocation: LiveLocationService) { }

  ngOnInit() {
    this.onInitLoading = true;

    // TODO: switch to one array for display markers
    this.displayMarkers = [];
    this.drawSegmentSet = [];

    this.displayBusIds = [];
    this.busMap = new Map();

    // initialize variables containing all data
    this.allRoutes = [];
    this.allSegments = new Map();
    this.allVehicles = new BehaviorSubject([]); // TODO: set an initial value to avoid first error
    this.bottomPanelHeight = this.DEFAULT_BOTTOM_PANEL_HEIGHT;
    this.currentRoute = 8004946;
    this.prefetchMapData(this.currentRoute);
    this.onInitLoading = false;
  }
  // TODO: add error handling to transloc data retrievals
  // TODO: add error handling to map component
  // TODO: look up algorithms to smoothen location transition / get rid of backlog

  setSegmentOptions(routeId: number) {
    const routeColor: string = this.allRoutes.filter(route => route.route_id == routeId.toString())[0].color;
    this.segmentOptions = {
      strokeColor: ('#' + routeColor)
    }
  }

  updateMarkers(routeId: number): void {
    this.displayMarkers = [];
    const finalStops = this.allStops.filter(stop => stop.routes.indexOf(routeId.toString()) > -1);
    for (let stop of finalStops) {
      this.displayMarkers.push(new StopMarker(stop.location, stop.name).toJSON());
    }
  }

  updateRoutes(routeId: number): void {
    this.drawSegmentSet = this.allSegments.get(routeId);
  }

  updateBuses(vehicles: Vehicle[]): void {
    vehicles.forEach(bus => {
      if (this.busMap.get(bus.id) == undefined) {
        const newDisplayBus = new VehicleMarker(bus.position, bus.call_name, bus.id).toJSON();
        this.displayBusIds.push(bus.id);
        this.busMap.set(bus.id, newDisplayBus);
      }
      else {
        const replaceBus = this.busMap.get(bus.id);
        replaceBus.position = new google.maps.LatLng(bus.position[0], bus.position[1]);
      }
    });
  }

  changeRoute(newRoute: number): void {
    // TODO: change the zoom and center level to see all of
    this.updateMarkers(newRoute);
    this.updateRoutes(newRoute);
    this.busTimerSubs.unsubscribe();
    this.startBusTimer(newRoute);
    // reset bus variables
    this.displayBusIds = [];
    this.busMap.clear();
    this.setSegmentOptions(newRoute);
    this.currentRoute = newRoute;
  }

  initMap(routeId: number) {
    this.mapLoading = true;
    this.isLoading = true;
    navigator.geolocation.getCurrentPosition((position) => { // set the map with case western as center
      this.mapCenter = {
        lat: 41.504324915824725,
        lng: -81.60848998642432,
      }
      this.isLoading = false;
    });
    this.mapLoading = false;
  }

  prefetchMapData(routeId: number) {
    this.prefetchLoading = true;
    const prefetch = of(3);
    prefetch.pipe(
      concatMap(_ => this.transloc.getRoutes()),
      tap(allRoutes => {
        this.transloc.setGlobalRoutes(allRoutes) // for ui only
      }),
      concatMap(allRoutes => {
        return forkJoin({
          stops: this.transloc.getStops(),
          routes: this.transloc.getRoutes(), // TODO: pass the retrieved route array instead
          segments: this.transloc.getSegmentsForAllRoutes(allRoutes)
        })
      })
    ).subscribe(prefetchedData => {
      this.allRoutes = prefetchedData.routes;
      this.allStops = prefetchedData.stops;
      this.allSegments = prefetchedData.segments;

      this.updateMarkers(routeId);
      this.updateRoutes(routeId);
      this.startBusTimer(routeId);
      this.setSegmentOptions(routeId);

      this.transloc.currentRouteNumber.subscribe(newCurrentRoute => {
        this.changeRoute(newCurrentRoute);
      });
      this.initMap(routeId);
      this.prefetchLoading = false;
    });
  }

  startBusTimer(routeId: number): void {
    this.busTimerLoading = true;
    this.busTimerSubs = this.getCurrentBusPositions(routeId).subscribe(allVehicleData => {

      this.allVehicles.next(allVehicleData);
      this.allVehicles.subscribe(vehicles => {
        this.updateBuses(vehicles)
      });
      this.busTimerLoading = false;
    });
  }

  getCurrentBusPositions(routeId: number): Observable<any> {
    return timer(0, 500).pipe(
      concatMap(_ => this.liveLocation.getArrivalData(routeId).pipe(take(1))),
    );
  }
}
