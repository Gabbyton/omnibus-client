import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { Route } from './models/route';
import { Stop } from './models/stop';
import { Vehicle } from './models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class TranslocService {

  SERVER_URL = 'http://localhost:5003';

  constructor(private http: HttpClient) { }

  getRoutes() {
    return this.http.get<Route[]>(`${this.SERVER_URL}/get-routes`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getStops() {
    return this.http.get<Stop[]>(`${this.SERVER_URL}/get-stops`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getSegmentsForRoute(routeId: string): Observable<any> {
    return this.http.get(`${this.SERVER_URL}/get-segment?route=${routeId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map(rawSegmentData => Object.keys(rawSegmentData).map(k => rawSegmentData[k])),
      map((allSegments: string[]) => allSegments.map(encSegment => google.maps.geometry.encoding.decodePath(encSegment)))
    );
  }

  getSegmentsForAllRoutes(allRoutes: Route[]): Observable<any> {
    let segmentObservables: Observable<any>[] = [];
    allRoutes.forEach((route: Route) => {
      segmentObservables.push(this.getSegmentsForRoute(route.route_id));
    });
    return forkJoin(segmentObservables).pipe(
      map(allSegments => {
        let segmentMap: Map<number, any[]> = new Map();
        allRoutes.forEach((route, index) => {
          segmentMap.set(parseInt(route.route_id), allSegments[index]);
        });
        return segmentMap;
      }));
  }

  getArrivalData(routeId: number) {
    return this.http.get<Vehicle[]>(`${this.SERVER_URL}/get-arrivals`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map((busArray: Vehicle[]) => busArray.filter(bus => bus.route_id == routeId)),
    );
  }
}
