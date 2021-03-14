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

  constructor($description: string, $short_name: string, $route_id: string, $color: string, $is_active: boolean, $agency_id: number, $text_color: string, $long_name: string, $url: string, $is_hidden: boolean, $type: string, $stops: string[]) {
    this.description = $description;
    this.short_name = $short_name;
    this.route_id = $route_id;
    this.color = $color;
    this.is_active = $is_active;
    this.agency_id = $agency_id;
    this.text_color = $text_color;
    this.long_name = $long_name;
    this.url = $url;
    this.is_hidden = $is_hidden;
    this.type = $type;
    this.stops = $stops;
  }

  getSegments(): string[] {
    return !!this.segments ? this.segments : [];
  }

  setSegments($segments: string[]): void {
    this.segments = $segments;
  }
}