import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { Route } from './data/models/route';
import { Stop } from './data/models/stop.model';

@Injectable({
  providedIn: 'root'
})
export class TranslocService {

  SERVER_URL = 'http://localhost:5003';

  allRoutes: BehaviorSubject<Route[]> = new BehaviorSubject([]);
  currentRouteNumber: BehaviorSubject<number> = new BehaviorSubject(8004946);
  currentRouteName: BehaviorSubject<string> = new BehaviorSubject("Greenlink"); // TODO: set defaults here instead

  constructor(private http: HttpClient) { }

  setGlobalRoutes(allNewRoutes: Route[]): void {
    this.allRoutes.next(allNewRoutes);
  }

  setGlobalCurrentRouteNumber(newCurrentRouteNumber: number) {
    this.currentRouteNumber.next(newCurrentRouteNumber);
  }

  setGlobalCurrentRouteName(newCurrentRouteName: string) {
    this.currentRouteName.next(newCurrentRouteName);
  }

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
}
