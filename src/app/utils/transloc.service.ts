import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslocService {

  SERVER_URL = 'http://localhost:5003';

  constructor(private http: HttpClient) { }

  getRoutes() {
    return this.http.get(`${this.SERVER_URL}/get-routes`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getStops() {
    return this.http.get(`${this.SERVER_URL}/get-stops`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
