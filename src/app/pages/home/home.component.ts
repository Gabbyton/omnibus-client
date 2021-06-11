import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { DrawerService } from 'src/app/utils/ui-services/drawer.service';
import { SplashService } from 'src/app/utils/ui-services/splash.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  currentRouteName: string;
  toggleButtons = [
    { icon: 'favorite' },
    { icon: 'own-toggle' },
    { icon: 'bus-toggle' },
    { icon: 'group-toggle' },
    { icon: 'pool-toggle' },
  ]

  constructor(
    private drawerService: DrawerService,
    private splashService: SplashService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('logo', sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/menu-icons/logo-white.svg'));
    iconRegistry.addSvgIcon('account', sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/menu-icons/account-white.svg'));
    this.toggleButtons.forEach(element => {
      console.log(element.icon);
      iconRegistry.addSvgIcon(element.icon, sanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/toggle-buttons/${element.icon}.svg`));
    });
  }

  ngOnInit(): void {
    this.splashService.hide();
    this.drawerService.toggleDrawerEmitter.subscribe(_ => {
      this.drawer.toggle();
    })
  }

}
