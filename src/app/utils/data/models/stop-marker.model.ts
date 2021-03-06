import { Marker } from "./marker.model";

const defaultSize = 24;
const defaultColor = '000000';
export class StopMarker extends Marker {
    color: string;
    stopId: string;
    size: number;
    constructor(stopId: string, location: number[], name: string, color: string, size?: number) {
        super(location, name, color);
        this.stopId = stopId;
        this.size = size ?? defaultSize;
    }

    public static getIcon(color?: string, size?: number): any {
        const displayColor = `#${color ?? defaultColor}`;
        return {
            // draw icon manually
            // TODO: generate this code from file
            url: `data:image/svg+xml;utf-8, \
            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M64,18.8V45.06q-9,9.07-18,18.15a2,2,0,0,1-1.26.61q-12.64,0-25.29,0a1.6,1.6,0,0,1-1-.41q-9-8.92-18-17.89A1.36,1.36,0,0,1,0,44.64Q0,32.11,0,19.58a1.75,1.75,0,0,1,.48-1.07Q9.38,9.6,18.26.71A1.65,1.65,0,0,1,19.55.16q12.38,0,24.74,0a1.94,1.94,0,0,1,1.52.63Q53.39,8.36,61,15.9C62,16.88,63,17.84,64,18.8ZM31.85,50.92v0h4.51l4.58,0c1.66,0,2.36.73,2.33,2.37a6.11,6.11,0,0,1-.07.86,2.8,2.8,0,0,0,2.12,3.09C47,57.66,48.53,57,49,55.59a8.2,8.2,0,0,0,.23-2.33c0-2.14.1-2.24,2.26-2.37.86-.06,1.24-.4,1.32-1.26a15.74,15.74,0,0,0,.06-1.82c0-3.89-.15-7.79-.14-11.69A122.62,122.62,0,0,0,50.88,15a6.76,6.76,0,0,0-4.61-5.67,39.52,39.52,0,0,0-17-2.59A40.77,40.77,0,0,0,17,9.64a5.61,5.61,0,0,0-3.68,4.65c-.12.81-.24,1.62-.32,2.43C12.41,22.81,11.61,28.9,11.25,35c-.27,4.7,0,9.43.07,14.14,0,1.6,0,1.6,1.56,1.63,1.27,0,1.8.51,1.93,1.8.07.68.1,1.36.17,2a2.79,2.79,0,0,0,2.85,2.78,3.09,3.09,0,0,0,3-3c0-.5,0-1,0-1.5,0-1.44.54-1.94,2-1.95Z" fill="${encodeURIComponent(displayColor)}"/> \
                <path d="M38.75,31.27H18.12c-2.61,0-3.29-.83-2.9-3.41.48-3.28.93-6.56,1.37-9.85.23-1.72.9-2.33,2.65-2.34l9.88-.05q6.91,0,13.83-.07a23.17,23.17,0,0,1,2.36.13,2,2,0,0,1,2.1,1.94c.4,2.44.73,4.89,1.07,7.34.18,1.25.39,2.5.47,3.76.1,1.78-.53,2.4-2.3,2.41h-7.9Z" fill="${encodeURIComponent(displayColor)}"/> \
                <path d="M30.79,10.72c3.05,0,6.11,0,9.16,0a1.64,1.64,0,0,1,1,.21,1.49,1.49,0,0,1,.47,1.11c-.05.29-.51.62-.84.73a5,5,0,0,1-1.34,0q-6.75,0-13.5.07c-.76,0-1.52-.05-2.28-.07a.93.93,0,0,1-1-.87,1,1,0,0,1,.83-1.16,5.31,5.31,0,0,1,1.25-.13c2.08,0,4.16,0,6.24,0Z" fill="${encodeURIComponent(displayColor)}"/> \
                <path d="M46.21,44.11a2.7,2.7,0,1,1,0-5.4A2.52,2.52,0,0,1,49,41.42,2.55,2.55,0,0,1,46.21,44.11Z" fill="${encodeURIComponent(displayColor)}"/> \
                <path d="M17.84,38.71a2.57,2.57,0,0,1,2.69,2.6,2.74,2.74,0,1,1-5.48.07A2.61,2.61,0,0,1,17.84,38.71Z" fill="${encodeURIComponent(displayColor)}"/> \
                <path d="M31.85,50.92h-9c-1.44,0-1.94.51-2,1.95,0,.5,0,1,0,1.5a3.09,3.09,0,0,1-3,3A2.79,2.79,0,0,1,15,54.62c-.07-.68-.1-1.36-.17-2-.13-1.29-.66-1.77-1.93-1.8-1.53,0-1.54,0-1.56-1.63-.05-4.71-.34-9.44-.07-14.14.36-6.11,1.16-12.2,1.78-18.29.08-.81.2-1.62.32-2.43A5.61,5.61,0,0,1,17,9.64,40.77,40.77,0,0,1,29.26,6.73a39.52,39.52,0,0,1,17,2.59A6.76,6.76,0,0,1,50.88,15a122.62,122.62,0,0,1,1.81,21.13c0,3.9.1,7.8.14,11.69a15.74,15.74,0,0,1-.06,1.82c-.08.86-.46,1.2-1.32,1.26-2.16.13-2.23.23-2.26,2.37A8.2,8.2,0,0,1,49,55.59c-.43,1.43-2,2.07-3.64,1.65a2.8,2.8,0,0,1-2.12-3.09,6.11,6.11,0,0,0,.07-.86c0-1.64-.67-2.35-2.33-2.37l-4.58,0H31.85Zm6.9-19.65v-.14h7.9c1.77,0,2.4-.63,2.3-2.41-.08-1.26-.29-2.51-.47-3.76-.34-2.45-.67-4.9-1.07-7.34a2,2,0,0,0-2.1-1.94A23.17,23.17,0,0,0,43,15.55q-6.91,0-13.83.07l-9.88.05c-1.75,0-2.42.62-2.65,2.34-.44,3.29-.89,6.57-1.37,9.85-.39,2.58.29,3.41,2.9,3.41Zm-8-20.55v-.08c-2.08,0-4.16,0-6.24,0a5.31,5.31,0,0,0-1.25.13,1,1,0,0,0-.83,1.16.93.93,0,0,0,1,.87c.76,0,1.52.08,2.28.07q6.75,0,13.5-.07a5,5,0,0,0,1.34,0c.33-.11.79-.44.84-.73A1.49,1.49,0,0,0,41,10.94a1.64,1.64,0,0,0-1-.21C36.9,10.71,33.84,10.72,30.79,10.72ZM46.21,44.11A2.55,2.55,0,0,0,49,41.42a2.52,2.52,0,0,0-2.7-2.71,2.7,2.7,0,1,0,0,5.4Zm-28.37-5.4a2.61,2.61,0,0,0-2.79,2.67,2.74,2.74,0,1,0,5.48-.07A2.57,2.57,0,0,0,17.84,38.71Z" fill="${encodeURIComponent('#fff')}"/> \
            </svg>`,
            scaledSize: new google.maps.Size(size ?? defaultSize, size ?? defaultSize),
        };
    }

    public toJSON(): any {
        return {
            position: {
                lat: this.position[0],
                lng: this.position[1],
            },
            title: this.title,
            stopId: this.stopId,
            options: {
                icon: StopMarker.getIcon(this.color, this.size),
                zIndex: (100),
            }
        }
    }
}