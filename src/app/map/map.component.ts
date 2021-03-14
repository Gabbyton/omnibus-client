import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from '../utils/transloc.service';
import { of } from "rxjs";
import { concatMap, tap, map } from "rxjs/operators";
import { Marker } from '../utils/marker';
import { Stop } from '../utils/stop';

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
    this.currentRoute = "8004946";
    this.markers = [];
    this.displayMarkers = [];
    this.stops = [];
    this.verticesSet = [];
    this.isLoading = false;
    this.initMap();
  }

  updateMarkers(): void {
    this.displayMarkers = [];
    this.markers = [];
    const finalStops = this.stops.filter(stop => stop.routes.indexOf(this.currentRoute) > -1);
    for (let stop of finalStops)
      this.markers.push(new Marker(stop.location, 'red', stop.name,stop.name));
    this.displayMarkers = this.markers.map(marker => marker.getMarkerMapsObject());
  }

  updateRoutes(): void { // FIXME: store all routes in memory/cache for quick loading
    this.transloc.getSegmentsForRoute(this.currentRoute).subscribe((encRoutes:string[]) => {
      this.verticesSet = [];
      encRoutes.forEach(encRoute=> {
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
      });
    });
  }

  changeRoute(newRoute: string): void {
    this.currentRoute = newRoute;
    this.updateMarkers();
    this.updateRoutes();
  }
}
