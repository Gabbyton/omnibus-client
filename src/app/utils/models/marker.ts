interface MarkerInterface {
  position: number[];
  labelColor: string;
  text: string;
  title: string;
  options?: any;
}

export class Marker implements MarkerInterface {
  position: number[];
  labelColor: string;
  text: string;
  title: string;
  options?: any;

  constructor(position: number[], labelColor: string, text: string, title: string, options?: any) {
    this.position = position;
    this.labelColor = labelColor;
    this.text = text;
    this.title = title;
    this.options = options; // or null
  }

  public getMarkerMapsObject(): any {
    return {
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
        icon: 'assets/rec-sm.png'
      }
      // TODO: add optional options
    }
  }
}
