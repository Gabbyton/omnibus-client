import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Vehicle } from './models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class LiveLocationService {

  SERVER_URL: string = "https://feeds.transloc.com/3/vehicle_statuses";

  constructor(private http: HttpClient) { }

  getArrivalData(routeId: number) {
    return this.http.get<Vehicle[]>(`${this.SERVER_URL}/get-arrivals`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map((rawData: any) => rawData.vehicles),
      map((busArray: Vehicle[]) => busArray.filter(bus => bus.route_id == routeId)),
    );
  }
}
