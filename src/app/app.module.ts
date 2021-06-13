import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './components/map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouteSelectComponent } from './components/route-select/route-select.component';
import { HomeComponent } from './pages/home/home.component';
import { SplashComponent } from './pages/splash/splash.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToggleButtonsComponent } from './components/toggle-buttons/toggle-buttons.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { AboutDropdownComponent } from './components/about-dropdown/about-dropdown.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { UserComponent } from './pages/user/user.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RouteSelectComponent,
    HomeComponent,
    SplashComponent,
    NavbarComponent,
    ToggleButtonsComponent,
    SearchbarComponent,
    AboutDropdownComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    SortablejsModule.forRoot({animation: 150}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
