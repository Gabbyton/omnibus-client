import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route } from './data/models/route.model';
import { Stop } from './data/models/stop.model';

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

  getSegmentsForAllRoutes(allRoutes: Route[]): Observable<Map<number, any[]>> {
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
}
