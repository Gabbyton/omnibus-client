import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/utils/models/route';
import { TranslocService } from 'src/app/utils/transloc.service';

@Component({
  selector: 'app-route-select',
  templateUrl: './route-select.component.html',
  styleUrls: ['./route-select.component.css']
})
export class RouteSelectComponent implements OnInit {
  
  displayRoutes: Route[];

  constructor(private translocService: TranslocService) { }

  ngOnInit(): void {
    this.displayRoutes = [];
    console.log('I have initialized');
    
    this.translocService.globalRoutes.subscribe(allRoutes => {
      this.displayRoutes = allRoutes;
      console.log(this.displayRoutes);
    });
  }

}
