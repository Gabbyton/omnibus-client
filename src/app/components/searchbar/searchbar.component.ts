import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { StopService } from 'src/app/utils/data/model-services/stop.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  stops: StopListItem[] = [];
  public model: StopListItem;
  formatter = (state: StopListItem) => state.name;
  enableSearch: boolean = false;

  constructor(private stopService: StopService) {
  }

  ngOnInit(): void {
    this.stops = this.stopService.allStops.map(stop => { return { id: parseInt(stop.stop_id), name: stop.name } });
  }

  search: OperatorFunction<string, readonly StopListItem[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.stops.filter(state => new RegExp(term, 'mi').test(state.name)).slice(0, 10))
  )

  evaluateContent(): void {
    if (this.model != null && this.model != undefined)
      this.enableSearch = this.stops.map(stop => stop.id).includes(this.model.id);
  }
}

interface StopListItem {
  id: number;
  name: string;
}
