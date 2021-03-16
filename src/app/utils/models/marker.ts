interface MarkerInterface {
  position: number[];
  labelColor: string;
  text: string;
  title: string;
  options?: any;
  id?: number;
}

export class Marker implements MarkerInterface {
  position: number[];
  labelColor: string;
  text: string;
  title: string;
  options?: any;
  id?: number;
  type: string;

  constructor(position: number[], labelColor: string, text: string, title: string, options?: any, id?: number, type?: string) {
    this.position = position;
    this.labelColor = labelColor;
    this.text = text;
    this.title = title;
    this.options = options; // or null
    this.id = id;
    this.type = type;
  }

  public getMarkerMapsObject(): any {
    return {
      id: this.id,
      position: {
        lat: this.position[0],
        lng: this.position[1],
      },
      title: this.title,
      options: {
        icon: {
          url: `assets/bus-${!!this.type? this.type:'stop'}.svg`,
          scaledSize: (this.type == 'vehicle' ? new google.maps.Size(50, 50) : new google.maps.Size(30, 30))
        },
        zIndex: (this.type == 'vehicle' ? 100 : 10)
      }
      // TODO: add optional options
    }
  }
}
