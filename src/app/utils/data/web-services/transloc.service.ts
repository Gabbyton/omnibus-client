import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route } from '../models/route.model';
import { Stop } from '../models/stop.model';
import { Vehicle } from '../models/vehicle';

const SERVER_URL = 'http://localhost:5003';
const dataRetrievalHeaders = {
  headers: {
    'Content-Type': 'application/json'
  }
}

@Injectable({
  providedIn: 'root'
})
export class TranslocService {

  constructor(private http: HttpClient) { }

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${SERVER_URL}/get-routes`, dataRetrievalHeaders);
  }

  getStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${SERVER_URL}/get-stops`, dataRetrievalHeaders);
  }

  private getSegmentsForRoute(routeId: string): Observable<any> {
    return this.http.get(`${SERVER_URL}/get-segment?route=${routeId}`, dataRetrievalHeaders).pipe(
      map(rawSegmentData => Object.keys(rawSegmentData) // retrieve all keys of object
        .map(k => rawSegmentData[k])), // substitute object keys with values
      map((allSegments: string[]) => allSegments // for each value that represents a list of encoded segments defining a subsection
        .map(encSegment => google.maps.geometry.encoding.decodePath(encSegment))), // substitute with the decoded list of segments
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

  getArrivalData(routeId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${SERVER_URL}/get-arrivals`, dataRetrievalHeaders).pipe(
      map(busArray => busArray.filter(bus => bus.route_id == routeId))
    );
  }

  getAllArrivalData(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${SERVER_URL}/get-arrivals`, dataRetrievalHeaders);
  }
}
