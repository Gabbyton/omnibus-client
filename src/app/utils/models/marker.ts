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

  constructor(position: number[], labelColor: string, text: string, title: string, options?: any, id?: number) {
    this.position = position;
    this.labelColor = labelColor;
    this.text = text;
    this.title = title;
    this.options = options; // or null
    this.id = id;
  }

  public getMarkerMapsObject(): any {
    return {
      id: this.id,
      position: {
        lat: this.position[0],
        lng: this.position[1],
      },
      label: {
        color: this.labelColor,
        text: this.text,
      },
      title: this.title,
      options: {
        icon: {
          url: 'assets/rec-sm.png',
          scaledSize: new google.maps.Size(20, 20)
        }
      }
      // TODO: add optional options
    }
  }
}
