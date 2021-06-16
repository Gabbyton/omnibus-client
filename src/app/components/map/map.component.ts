import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Subscription, timer } from "rxjs";
import { concatMap, tap } from "rxjs/operators";
import { StopService } from '../../utils/data/model-services/stop.service';
import { BusService } from '../../utils/data/model-services/bus.service';
import { RouteService } from '../../utils/data/model-services/route.service';
import { SegmentService } from '../../utils/data/model-services/segment.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  // field for rendering
  displayMarkers: any[] = [];
  drawSegmentSet: any[] = [];
  displayVehicles: Map<number, any>;

  private vehicleUpdateTimerSubscription: Subscription;
  isLoading: boolean = false;

  // map fields
  mapZoom = 17;
  mapCenter: google.maps.LatLngLiteral;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
    gestureHandling: "greedy", // TODO: add once testing on actual devices
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
    // TODO: look up algorithms to smoothen location transition / get rid of backlog
    this.prefetchMapData();
  }

  initMap() {
    this.mapCenter = {
      lat: 41.504324915824725,
      lng: -81.60848998642432,
    }
  }

  prefetchMapData() {
    this.updateMapObjects(this.routeService.currentRouteIDValue);
    this.initMap();
    this.routeService.currentRouteIDSubject.subscribe(newCurrentRouteID => {
      this.changeRoute(newCurrentRouteID);
    });
  }

  updateMapObjects(routeId: number, changeRoute?: boolean): void {
    this.displayMarkers = this.stopService.getStopsToDisplay(routeId);
    this.drawSegmentSet = this.segmentService.getSegment(routeId);
    this.changeSegmentColor();
    this.startBusTimer(routeId, changeRoute);
  }

  changeSegmentColor() {
    this.segmentOptions = {
      strokeColor: (`#${this.routeService.getRouteColor(this.routeService.currentRouteIDValue)}`),
    }
  }

  changeRoute(newRoute: number): void {
    // TODO: change the zoom and center level to see all of route area
    this.vehicleUpdateTimerSubscription.unsubscribe(); // unsubscribe to prevent data leaks
    this.updateMapObjects(newRoute, true);
  }

  changeCurrentStop(newStopId: number) {
    console.log(`the new stop id: ${newStopId}`);

  }

  startBusTimer(routeId: number, changeRoute?: boolean): void {
    this.vehicleUpdateTimerSubscription = timer(0, 500).pipe(
      concatMap(_ => this.busService.getBusesToDisplay(routeId, changeRoute)),
      tap(_ => { changeRoute = false }),
    ).subscribe(busesToDisplay => {
      this.displayVehicles = busesToDisplay;
    });
  }
}
