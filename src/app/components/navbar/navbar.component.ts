import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isUserOpen: boolean = false;
  @Output('onUserClosed') onUserClosed = new EventEmitter<boolean>();

  accountIcon = { icon: 'account', location: 'assets/icons/menu-icons/account-white.svg' };
  homeIcon = { icon: 'home', location: 'assets/icons/user-icons/home.svg' };
  constructor() { }

  ngOnInit(): void {
  }

  onUserClosedButtonPressed(): void {
    this.isUserOpen = !this.isUserOpen;
    this.onUserClosed.emit(this.isUserOpen);
  }

}
