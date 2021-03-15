import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  svgMarker = {
    path:
      "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };

  constructor(private transloc: TranslocService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentRoute = "8004946";
    this.markers = [];
    this.displayMarkers = [];
    this.stops = [];
    this.verticesSet = [];
    this.isLoading = false;
    this.displayBuses = [];
    this.busMap = new Map();
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
            busArray.forEach(bus => {
              if(this.displayBuses.indexOf( bus.id ) < 0) {
                const newDisplayBus = new Marker(bus.position, 'red', bus.call_name, bus.call_name, '',bus.id,'vehicle').getMarkerMapsObject();
                this.displayBuses.push(bus.id);
                this.busMap.set(bus.id, newDisplayBus);
              }
              else { // FIXME: marker position not updating
                const replaceBus = this.busMap.get(bus.id);
                console.log(`replace bus:`);
                console.log(replaceBus);
                replaceBus.position = new google.maps.LatLng(bus.position[0],bus.position[1]);
              }
              this.changeDetectorRef.detectChanges();
            });
          }),
          take(1)
        );
      }),
    )
  }

  // TODO: add angular animations to expand button
}
