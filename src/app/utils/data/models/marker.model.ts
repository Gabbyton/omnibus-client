export abstract class Marker {
    position: number[];
    title: string;
    color: string;

    constructor(position: number[], title: string, color: string) {
        this.position = position;
        this.title = title;
        this.color = color;
    }

    abstract toJSON(): any;
}