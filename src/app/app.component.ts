import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { TranslocService } from './utils/transloc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'transloc-app-wrapper';
  markers: any[] = [];
  stops: any[] = [];
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  zoom = 20
  center: google.maps.LatLngLiteral
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.transloc.getStops().subscribe((data: any) => {
        for (let element of data) {
          this.stops.push(element);
        }
        console.log(this.stops);
        this.addMarker();
      });
    });
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
        options: { animation: google.maps.Animation.BOUNCE },
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
}
