import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OwnToggleService } from 'src/app/utils/ui-services/own-toggle.service';
import { UiService } from 'src/app/utils/ui-services/ui.service';

@Component({
  selector: 'app-toggle-buttons',
  templateUrl: './toggle-buttons.component.html',
  styleUrls: ['./toggle-buttons.component.scss']
})
export class ToggleButtonsComponent implements OnInit {
  @Output('onMenuButtonClicked') onMenuButtonClicked = new EventEmitter<boolean>();
  toggleButtons: MenuButton[];

  constructor(
    private uiService: UiService,
    private ownToggle: OwnToggleService,
  ) { }

  ngOnInit(): void {
    // initially populate button array with null buttons
    this.initButtons();
    // set button image asset location
    this.toggleButtons.forEach(button => {
      button['location'] = `assets/icons/toggle-buttons/${button.icon}.svg`;
    });
    // add menu button
    this.toggleButtons.push({ icon: 'menu', location: 'assets/icons/menu-icons/menu.svg', disabled: false, toggled: false, callback: null });
    this.assignButtonFunctions();
    // set buttons to listen to ui service disable
    this.uiService.disableToggleObs.subscribe(disable => {
      for (let index = 0; index < this.toggleButtons.length; index++) {
        if (index != MenuButtonIndex.favorite && index != MenuButtonIndex.menu) {
          const button = this.toggleButtons[index];
          if (button.toggled) button.toggled = false;
          button.disabled = disable;
        }
      }
    });
  }

  initButtons(): void {
    this.toggleButtons = [
      { icon: 'favorite', location: null, disabled: false, toggled: false, callback: null },
      { icon: 'own-toggle', location: null, disabled: false, toggled: false, callback: null },
      { icon: 'bus-toggle', location: null, disabled: false, toggled: false, callback: null },
    ]
  }

  assignButtonFunctions(): void {
    this.toggleButtons[MenuButtonIndex.ownToggle].callback = (state: boolean) => { this.ownToggle.toggleShowLocation(state) }; // wrap in arrow function to pass context
    this.toggleButtons[MenuButtonIndex.menu].callback = () => { this.toggleRoutePage() }; // wrap in arrow function to pass context
  }

  toggleButton(buttonIndex: number): void {
    const button = this.toggleButtons[buttonIndex];
    // execute callback
    if (button.callback != null) {
      button.callback(this.toggleButtons[buttonIndex].toggled);
    }
    if (buttonIndex != MenuButtonIndex.favorite && buttonIndex != MenuButtonIndex.menu) {
      button.toggled = !button.toggled;
    }
  }

  toggleRoutePage() {
    this.onMenuButtonClicked.emit(true);
  }
}

interface MenuButton {
  icon: string;
  location: string;
  toggled: boolean;
  disabled: boolean;
  callback: (state?: boolean) => void;
}

enum MenuButtonIndex {
  favorite = 0,
  ownToggle = 1,
  busToggle = 2,
  menu = 3,
}