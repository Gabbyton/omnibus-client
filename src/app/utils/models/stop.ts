interface StopInterface {
  name: string;
  stop_id: string;
  location: number[];
  routes: string[];
}

export class Stop implements StopInterface{
  name: string;
  stop_id: string;
  location: number[];
  routes: string[];

  constructor( name:string, stop_id: string, location:number[], routes:string[] ) {
    this.name = name;
    this.stop_id = stop_id;
    this.location = location;
    this.routes = routes;
  }

  private getStopMapsObject() {
    return {
      "name": this.name,
      "stop_id": this.stop_id,
      "location": this.location,
      "routes": this.routes
    }
  }
}