import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { UiService } from 'src/app/utils/ui-services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  currentRouteName: string;
  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.toggleDrawerEmitter.subscribe(_ => {
      this.drawer.toggle();
    })
  }

}
