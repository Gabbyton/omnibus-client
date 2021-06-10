import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { UiService } from '../ui-services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadGuard implements Resolve<any> {

  constructor(private uiService: UiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.uiService.prefetchMapData();
  }
}
