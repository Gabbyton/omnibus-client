import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  routeSubscribe(routeId: number, stopId: number): void {
    this.socket.emit('subscribe', {
      routeId: routeId,
      stopId: stopId,
    });
  }

  routeUnsubscribeAll(): void {
    this.socket.emit('unsubscribe');
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  onRouteJoined(): Observable<any> {
    return this.socket.fromEvent('user-joined');
  }

  onRouteExited(): Observable<any> {
    return this.socket.fromEvent('user-exited');
  }
}
