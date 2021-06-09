export class Route {
  description: string;
  short_name: string;
  route_id: string;
  color: string;
  is_active: boolean;
  agency_id: number;
  text_color: string;
  long_name: string;
  url: string;
  is_hidden: boolean;
  type: string;
  stops: string[];
  segments?: string[];

  getSegments(): string[] {
    console.warn(`the segments array is null`);
    return this.segments ?? [];
  }

  setSegments($segments: string[]): void {
    this.segments = $segments;
  }
}