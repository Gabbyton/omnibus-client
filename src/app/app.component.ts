import { ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from './utils/transloc.service';
import { of } from "rxjs";
import { concatMap, tap, map } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  title = 'transloc-app-wrapper';

  markers: any[] = [];
  stops: any[] = [];

  verticesSet: any[];

  isLoading: boolean;

  zoom = 16;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  }

  constructor(private transloc: TranslocService) { }

  ngOnInit() {
    this.initMap();
  }

  addMarker() {
    for (let stop of this.stops) {
      this.markers.push({
        position: {
          lat: stop.location[0],
          lng: stop.location[1],
        },
        label: {
          color: 'red',
          text: stop.name,
        },
        title: stop.name,
        // options: { animation: google.maps.Animation.BOUNCE },
      })
    }
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  click(event: google.maps.MouseEvent) {
    console.log(event)
  }

  initMap(): void {
    this.isLoading = true;
    const startupSeq = of(2);
    this.verticesSet = [];
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      startupSeq.pipe(
        tap(data => console.log(data)),
        concatMap(data => {
          return this.transloc.getSegmentsForRoute("blah");
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
        this.addMarker();
        this.isLoading = false;
      });
    });
  }
}
