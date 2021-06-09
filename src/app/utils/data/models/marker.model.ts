export abstract class Marker {
    position: number[];
    title: string;

    constructor(position: number[], title: string) {
        this.position = position;
        this.title = title;
    }

    abstract toJSON(): any;
}