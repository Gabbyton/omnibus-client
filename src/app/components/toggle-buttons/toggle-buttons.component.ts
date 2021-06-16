import { Component, OnInit } from '@angular/core';
import { OwnToggleService } from 'src/app/utils/ui-services/own-toggle.service';

@Component({
  selector: 'app-toggle-buttons',
  templateUrl: './toggle-buttons.component.html',
  styleUrls: ['./toggle-buttons.component.scss']
})
export class ToggleButtonsComponent implements OnInit {
  // TODO: transfer state to respective button services
  toggleButtons: MenuButton[];

  constructor(private ownToggle: OwnToggleService) { }

  ngOnInit(): void {
    this.initButtons();
    this.toggleButtons.forEach(element => {
      element['location'] = `assets/icons/toggle-buttons/${element.icon}.svg`;
    });
    this.toggleButtons.push({ icon: 'menu', location: 'assets/icons/menu-icons/menu.svg', toggled: false, callback: null });
    this.assignButtonFunctions();
  }

  initButtons(): void {
    this.toggleButtons = [
      { icon: 'favorite', location: null, toggled: false, callback: null },
      { icon: 'own-toggle', location: null, toggled: false, callback: null },
      { icon: 'bus-toggle', location: null, toggled: false, callback: null },
      { icon: 'group-toggle', location: null, toggled: false, callback: null },
      { icon: 'pool-toggle', location: null, toggled: false, callback: null },
    ]
  }

  assignButtonFunctions(): void {
    this.toggleButtons[MenuButtonIndex.ownToggle].callback = (state: boolean) => { this.ownToggle.toggleShowLocation(state) }; // wrap in arrow function to pass context
  }

  toggleButton(buttonIndex: number): void {
    const button = this.toggleButtons[buttonIndex];
    // execute callback
    if (button.callback != null) {
      console.log('hello');
      button.callback(this.toggleButtons[buttonIndex].toggled);
    }
    if (buttonIndex == MenuButtonIndex.poolToggle) {
      const ownToggleButton = this.toggleButtons[MenuButtonIndex.ownToggle];
      ownToggleButton.toggled = true; // set own toggle button to true
      const ownToggleFunction = ownToggleButton.callback;
      if (ownToggleFunction != null && !ownToggleButton.toggled) ownToggleFunction(ownToggleButton.toggled);
    }
    if (buttonIndex != MenuButtonIndex.favorite && buttonIndex != MenuButtonIndex.menu)
      button.toggled = !button.toggled;
  }
}

interface MenuButton {
  icon: string;
  location: string;
  toggled: boolean;
  callback: (state: boolean) => void;
}

enum MenuButtonIndex {
  favorite = 0,
  ownToggle = 1,
  busToggle = 2,
  groupToggle = 3,
  poolToggle = 4,
  menu = 5,
}