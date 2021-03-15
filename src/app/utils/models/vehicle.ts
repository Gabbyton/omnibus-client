export class Vehicle {
    id: number;
    service_status: string;
    agency_id: number;
    route_id: number;
    trip_id: number;
    TripStart: string;
    TripEnd: string;
    gtfs_trip_id: string;
    direction: boolean;
    stop_pattern_id: number;
    call_name: string;
    current_stop_id: number;
    next_stop: number;
    arrival_status: string;
    position: number[];
    heading: number;
    speed: number;
    segment_id: number;
    off_route: boolean;
    timestamp: number;
    load: string;
    apc_status: string;
}