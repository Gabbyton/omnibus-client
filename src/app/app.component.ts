import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { SplashService } from './utils/ui-services/splash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transloc-app-wrapper';
}