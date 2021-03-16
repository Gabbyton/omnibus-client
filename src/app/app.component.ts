import { Component, OnInit } from '@angular/core';
import { TranslocService } from './utils/transloc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'transloc-app-wrapper';
  currentRouteName: string;

  constructor(private translocService: TranslocService) {}
  
  ngOnInit(): void {
    this.currentRouteName = "";
    this.translocService.currentRouteName.subscribe(currentRouteName => {
      this.currentRouteName = currentRouteName;
    });
  }
}