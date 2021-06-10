import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from '../utils/transloc.service';
import { forkJoin, of, Subscription, timer } from "rxjs";
import { concatMap, tap } from "rxjs/operators";
import { StopService } from '../utils/data/services/stop.service';
import { BusService } from '../utils/data/services/bus.service';
import { RouteService } from '../utils/data/services/route.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  // fields containing map data
  allSegments: Map<number, any[]> = new Map();

  // field for rendering
  displayMarkers: any[] = [];
  displayVehicles: Map<number, any>;
  drawSegmentSet: any[] = [];

  private vehicleUpdateTimerSubscription: Subscription;

  currentRoute: number;

  // ui fields
  prefetchLoading: boolean;
  busTimerLoading: boolean;
  mapLoading: boolean;
  onInitLoading: boolean;

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

  constructor(
    private transloc: TranslocService,
    private stopService: StopService,
    private busService: BusService,
    private routeService: RouteService,
  ) { }

  ngOnInit() {
    this.currentRoute = 8004948;
    this.prefetchMapData(this.currentRoute);
  }
  // TODO: add error handling to transloc data retrievals
  // TODO: look up algorithms to smoothen location transition / get rid of backlog

  setSegmentOptions(routeId: number) {
    var routeColor: string = this.routeService.getRoute(
      this.routeService.currentRouteID.value).color;
    this.segmentOptions = {
      strokeColor: ('#' + routeColor)
    }
  }

  updateRoutes(routeId: number): void {
    this.drawSegmentSet = this.allSegments.get(routeId);
  }

  changeRoute(newRoute: number): void {
    // TODO: change the zoom and center level to see all of
    // TODO: place new service functions here
    this.displayMarkers = this.stopService.getStopsToDisplay(newRoute);
    this.vehicleUpdateTimerSubscription.unsubscribe(); // unsubscribe to prevent data leaks
    this.updateRoutes(newRoute);
    this.startBusTimer(newRoute, true);
    this.setSegmentOptions(newRoute);
    this.currentRoute = newRoute;
  }

  initMap() {
    this.mapLoading = true;
    this.isLoading = true;
    this.mapCenter = {
      lat: 41.504324915824725,
      lng: -81.60848998642432,
    }
    this.isLoading = false;
    this.mapLoading = false;
  }

  prefetchMapData(routeId: number) {
    this.prefetchLoading = true;
    const prefetch = of(3);
    prefetch.pipe(
      concatMap(_ => {
        return this.routeService.prefetch();
      }),
      concatMap(_ => {
        return forkJoin({
          isStopLoadingComplete: this.stopService.prefetch(),
          segments: this.transloc.getSegmentsForAllRoutes(this.routeService.getAllRoutes()),
        })
      })
    ).subscribe(prefetchedData => {
      this.allSegments = prefetchedData.segments;
      this.displayMarkers = this.stopService.getStopsToDisplay(routeId);
      this.startBusTimer(routeId);
      this.updateRoutes(routeId);
      this.setSegmentOptions(routeId);
      this.routeService.currentRouteID.subscribe(newCurrentRouteID => {
        this.changeRoute(newCurrentRouteID);
      });
      this.initMap();
      this.prefetchLoading = false;
    });
  }

  startBusTimer(routeId: number, changeRoute?: boolean): void {
    this.busTimerLoading = true;
    this.vehicleUpdateTimerSubscription = timer(0, 500).pipe(
      concatMap(_ => this.busService.getBusesToDisplay(routeId, changeRoute)),
      tap(_ => { changeRoute = false }),
    ).subscribe(busesToDisplay => {
      this.displayVehicles = busesToDisplay;
      this.busTimerLoading = false;
    });
  }
}
