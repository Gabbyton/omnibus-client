import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Subscription, timer } from "rxjs";
import { concatMap, tap } from "rxjs/operators";
import { StopService } from '../../utils/data/model-services/stop.service';
import { BusService } from '../../utils/data/model-services/bus.service';
import { RouteService } from '../../utils/data/model-services/route.service';
import { SegmentService } from '../../utils/data/model-services/segment.service';
import { StopMarker } from 'src/app/utils/data/models/stop-marker.model';

const mapDefaultZoom = 17;
const defaultRefreshMillis = 500;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  // field for rendering
  displayMarkers: any[] = [];
  drawSegmentSuperset: { segmentOptions: any, segmentSet: any[] }[] = [];
  displayVehicles: Map<number, any> = new Map();
  currentStopMarker: any;

  private vehicleUpdateTimerSubscription: Subscription;
  isLoading: boolean = false;

  // map fields
  mapZoom = mapDefaultZoom;
  mapCenter: google.maps.LatLngLiteral;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
    gestureHandling: "greedy",
    disableDefaultUI: true,
  }
  segmentOptions: google.maps.PolylineOptions;

  constructor(
    private stopService: StopService,
    private busService: BusService,
    private routeService: RouteService,
    private segmentService: SegmentService,
  ) { }

  ngOnInit() {
    // TODO: add error handling to transloc data retrievals
    // TODO: get rid of data backlog if possible, i.e. vehicles skipping back
    this.prefetchMapData();
    // listen to changes to active routes
    this.routeService.activeRoutesChanged.subscribe(_ => {
      this.unsubscribeFromBusTimer();
      this.updateMapObjects(true);
    });
  }

  initMap() {
    // coordinates for case western reserve university
    this.mapCenter = {
      lat: 41.504324915824725,
      lng: -81.60848998642432,
    }
  }

  prefetchMapData() {
    this.updateMapObjects();
    this.initMap();
  }

  updateMapObjects(changeRoute?: boolean): void {
    // reset map-rendered artifacts
    this.displayMarkers = [];
    this.drawSegmentSuperset = [];
    this.displayVehicles.clear();
    // TODO: get array of shared intersections and display an intersection icon respectively
    for (const activeRouteId of this.routeService.activeRoutes) {
      const routeColor = this.routeService.getRouteColor(activeRouteId);
      this.displayMarkers = this.displayMarkers.concat(this.stopService.getStopsToDisplay(activeRouteId));
      this.drawSegmentSuperset.push({
        segmentOptions: { strokeColor: `#${routeColor}` },
        segmentSet: this.segmentService.getSegment(activeRouteId)
      });
    }
    if (this.routeService.activeRoutes.length > 0)
      this.startBusTimer(changeRoute);
  }

  changeCurrentStop(newStopId: number, displayMarkerIndex: number) {
    this.stopService.setCurrentStopId(newStopId);
    const rawPosition = this.displayMarkers[displayMarkerIndex].position;
    const finalPosition = [rawPosition.lat, rawPosition.lng];
    // TODO: replace with own custom marker
    this.currentStopMarker = new StopMarker(`${newStopId}`, finalPosition, 'Current Stop', '00ff00', 60).toJSON();
    this.map.panTo(rawPosition);
  }

  startBusTimer(changeRoute?: boolean): void {
    this.unsubscribeFromBusTimer();
    this.vehicleUpdateTimerSubscription = timer(0, defaultRefreshMillis).pipe(
      concatMap(_ => this.busService.getBusesToDisplay(changeRoute)),
      tap(_ => { changeRoute = false }), // set change route to false for this timer after first iteration
    ).subscribe(busesToDisplay => {
      this.displayVehicles = busesToDisplay;
    });
  }

  private unsubscribeFromBusTimer() {
    if (this.vehicleUpdateTimerSubscription != null) {
      this.vehicleUpdateTimerSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromBusTimer();
  }
}

