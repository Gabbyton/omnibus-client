import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UiService } from './utils/ui-services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  title = 'transloc-app-wrapper';
  currentRouteName: string;

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.toggleDrawerEmitter.subscribe(_ => {
      this.drawer.toggle();
    })
  }
}