import { Marker } from "./marker.model";

export class StopMarker extends Marker {

    constructor(location: number[], name: string) {
        super(location, name);
    }

    public toJSON(): any {
        return {
            position: {
                lat: this.position[0],
                lng: this.position[1],
            },
            title: this.title,
            options: {
                icon: {
                    url: `assets/stop.svg`,
                    scaledSize: new google.maps.Size(30, 30),
                },
                zIndex: (10),
            }
        }
    }
}