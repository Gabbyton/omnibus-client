import { Marker } from "./marker.model";

export class VehicleMarker extends Marker {
    id: number;

    constructor(position: number[], callName: string, color: string, id: number) {
        super(position, callName, color);
        this.id = id;
    }

    toJSON(): any {
        return {
            id: this.id,
            position: {
                lat: this.position[0],
                lng: this.position[1],
            },
            title: this.title,
            options: {
                icon: {
                    url: `assets/vehicle.svg`,
                    scaledSize: new google.maps.Size(50, 50),
                },
                zIndex: (100),
            }
        }
    }
}