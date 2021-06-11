import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-buttons',
  templateUrl: './toggle-buttons.component.html',
  styleUrls: ['./toggle-buttons.component.scss']
})
export class ToggleButtonsComponent implements OnInit {
  // TODO: transfer state to respective button services
  toggleButtons: { icon: string, location: string, toggled: boolean }[] = [
    { icon: 'favorite', location: null, toggled: false },
    { icon: 'own-toggle', location: null, toggled: false },
    { icon: 'bus-toggle', location: null, toggled: false },
    { icon: 'group-toggle', location: null, toggled: false },
    { icon: 'pool-toggle', location: null, toggled: false },
  ]
  constructor() { }

  ngOnInit(): void {
    this.toggleButtons.forEach(element => {
      element['location'] = `assets/icons/toggle-buttons/${element.icon}.svg`;
    });
    this.toggleButtons.push({ icon: 'menu', location: 'assets/icons/menu-icons/menu.svg', toggled: false });
  }

  toggleButton(buttonIndex: number) {
    const button = this.toggleButtons[buttonIndex];
    if (buttonIndex == 4)
      this.toggleButtons[1].toggled = true;
    if (buttonIndex != 0 && buttonIndex != this.toggleButtons.length - 1)
      button.toggled = !button.toggled;
  }
}
