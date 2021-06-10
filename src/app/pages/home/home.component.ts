import { AfterViewChecked, Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { DrawerService } from 'src/app/utils/ui-services/drawer.service';
import { SplashService } from 'src/app/utils/ui-services/splash.service';
import { UiService } from 'src/app/utils/ui-services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  currentRouteName: string;

  constructor(
    private drawerService: DrawerService,
    private splashService: SplashService,
  ) { }

  ngOnInit(): void {
    this.splashService.hide();
    this.drawerService.toggleDrawerEmitter.subscribe(_ => {
      this.drawer.toggle();
    })
  }

}
