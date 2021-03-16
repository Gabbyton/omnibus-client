import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from '../utils/transloc.service';
import { BehaviorSubject, forkJoin, Observable, of, Subscription, timer } from "rxjs";
import { concatMap, take, tap } from "rxjs/operators";
import { Marker } from '../utils/models/marker';
import { Stop } from '../utils/models/stop';
import { Route } from '../utils/models/route';
import { Vehicle } from '../utils/models/vehicle';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  // fields containing map data
  allStops: Stop[];
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
  bottomPanelHeight: number;
  DEFAULT_BOTTOM_PANEL_HEIGHT: number;
  EXPANDED_BOTTOM_PANEL_HEIGHT: number;

  isLoading: boolean;

  // map fields
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

  // TODO: create local caching startup sequence

  ngOnInit() {
    // set default parameters
    this.DEFAULT_BOTTOM_PANEL_HEIGHT = 25;
    this.EXPANDED_BOTTOM_PANEL_HEIGHT = 50;

    // initialize dynamic variables
    this.isLoading = false;
    // TODO: switch to one array for display markers
    this.displayMarkers = [];
    this.drawSegmentSet = [];

    this.displayBusIds = [];
    this.busMap = new Map();

    // initialize variables containing all data
    this.allRoutes = [];
    this.allSegments = new Map();
    this.allStops = [];
    this.allVehicles = new BehaviorSubject([]); // TODO: set an initial value to avoid first error
    this.bottomPanelHeight = this.DEFAULT_BOTTOM_PANEL_HEIGHT;
    this.currentRoute = 8004946;
    this.isLoading = true;
    this.prefetchMapData(this.currentRoute);
  }

  // TODO: assign buttons to route setting methods
  // TODO: add color assignments to routes
  // TODO: add error handling to transloc data retrievals
  // TODO: add error handling to map component
  // TODO: look up algorithms to smoothen location transition / get rid of backlog

  expandBottomPanel(): void {
    if (this.bottomPanelHeight != this.DEFAULT_BOTTOM_PANEL_HEIGHT)
      this.bottomPanelHeight = this.DEFAULT_BOTTOM_PANEL_HEIGHT;
    else
      this.bottomPanelHeight = this.EXPANDED_BOTTOM_PANEL_HEIGHT;
  }

  updateMarkers(routeId: number): void {
    this.displayMarkers = [];
    const finalStops = this.allStops.filter(stop => stop.routes.indexOf(routeId.toString()) > -1);
    for (let stop of finalStops) {
      this.displayMarkers.push(new Marker(stop.location, 'red', stop.name, stop.name).getMarkerMapsObject());
    }
  }

  updateRoutes(routeId: number): void {
    this.drawSegmentSet = this.allSegments.get(routeId);
  }

  updateBuses(vehicles: Vehicle[]): void {
    vehicles.forEach(bus => {
      if (this.busMap.get(bus.id) == undefined) {
        const newDisplayBus = new Marker(bus.position, 'red', bus.call_name, bus.call_name, '', bus.id, 'vehicle').getMarkerMapsObject();
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
    // FIXME: alert component to show loading while any process is executing
    this.updateMarkers(newRoute);
    this.updateRoutes(newRoute);
    this.busTimerSubs.unsubscribe();
    this.startBusTimer(newRoute);
    // reset bus variables
    this.displayBusIds = [];
    this.busMap.clear();
    this.currentRoute = newRoute;
  }

  initMap(routeId: number) {
    this.isLoading = true;
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.isLoading = false;
    });
  }

  prefetchMapData(routeId: number) {
    this.isLoading = true;
    const prefetch = of(3);
    prefetch.pipe(
      concatMap(_ => this.transloc.getRoutes()),
      tap(allRoutes => {
        this.transloc.setGlobalRoutes(allRoutes)
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
      this.allStops = prefetchedData.stops; // TODO: save all stops to a hashmap
      this.allSegments = prefetchedData.segments;

      this.updateMarkers(routeId);
      this.updateRoutes(routeId);
      this.startBusTimer(routeId);

      this.transloc.currentRouteNumber.subscribe(newCurrentRoute => {
        this.changeRoute(newCurrentRoute);
      });
      this.initMap(routeId);
    });
  }

  startBusTimer(routeId: number): void {
    this.busTimerSubs = this.getCurrentBusPositions(routeId).subscribe(allVehicleData => {
      this.allVehicles.next(allVehicleData);
      this.allVehicles.subscribe(vehicles => {
        this.updateBuses(vehicles)
      });
      this.isLoading = false; // TODO: find a better place for this
    });
  }

  getCurrentBusPositions(routeId: number): Observable<any> {
    return timer(0, 500).pipe(
      concatMap(_ => this.transloc.getArrivalData(routeId).pipe(take(1))),
    );
  }
  // TODO: add angular animations to expand button
}
