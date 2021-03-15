import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { map, filter, tap } from 'rxjs/operators';
import { Stop } from './models/stop';
import { Vehicle } from './models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class TranslocService {

  SERVER_URL = 'http://localhost:5003';

  constructor(private http: HttpClient) { }

  getRoutes() {
    return this.http.get<Route>(`${this.SERVER_URL}/get-routes`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getStops() {
    return this.http.get<Stop>(`${this.SERVER_URL}/get-stops`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getSegmentsForRoute(routeId: string) {
    return this.http.get(`${this.SERVER_URL}/get-segment?route=${routeId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map(data => Object.keys(data).map(k => data[k]))
    );
  }

  getArrivalData() {
    return this.http.get<Vehicle[]>(`${this.SERVER_URL}/get-arrivals`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
