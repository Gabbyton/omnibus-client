import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-buttons',
  templateUrl: './toggle-buttons.component.html',
  styleUrls: ['./toggle-buttons.component.scss']
})
export class ToggleButtonsComponent implements OnInit {
  toggleButtons: { icon: string, location: string }[] = [
    { icon: 'favorite', location: null },
    { icon: 'own-toggle', location: null },
    { icon: 'bus-toggle', location: null },
    { icon: 'group-toggle', location: null },
    { icon: 'pool-toggle', location: null },
  ]
  constructor() { }

  ngOnInit(): void {
    this.toggleButtons.forEach(element => {
      element['location'] = `assets/icons/toggle-buttons/${element.icon}.svg`;
    });
    this.toggleButtons.push({ icon: 'menu', location: 'assets/icons/menu-icons/menu.svg' });
  }

}
