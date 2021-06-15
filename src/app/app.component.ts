import { Component, OnInit } from '@angular/core';
import * as SlidingMarker from "node_modules/marker-animate-unobtrusive/dist/SlidingMarker.min.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'transloc-app-wrapper';

  ngOnInit(): void {
    // TODO: optimize import
    SlidingMarker.initializeGlobally();
  }
}