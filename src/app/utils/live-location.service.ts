import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Vehicle } from './models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class LiveLocationService {

  SERVER_URL: string = `http://localhost:5003`;

  constructor(private http: HttpClient) { }

  getArrivalData(routeId: number) {
    return this.http.get<Vehicle[]>(`${this.SERVER_URL}/get-arrivals`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map((rawData: any) => !!rawData.vehicles ? rawData.vehicles : []),
      map((busArray: Vehicle[]) => busArray.length > 0 ? busArray.filter(bus => bus.route_id == routeId) : [])
    );
  }
}
