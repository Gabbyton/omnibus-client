import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UiService } from './utils/ui-services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'transloc-app-wrapper';

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}