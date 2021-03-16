import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslocService } from './utils/transloc.service';
import { UiService } from './utils/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  title = 'transloc-app-wrapper';
  currentRouteName: string;

  constructor(private translocService: TranslocService, private uiService: UiService) { }

  ngOnInit(): void {
    this.currentRouteName = "";
    this.translocService.currentRouteName.subscribe(currentRouteName => {
      this.currentRouteName = currentRouteName;
    });
    this.uiService.toggleDrawerEmitter.subscribe(_ => {
      this.drawer.toggle();
    })
  }
}