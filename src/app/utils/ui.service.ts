import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  toggleDrawerEmitter: EventEmitter<void> = new EventEmitter();

  constructor() { }

  toggleDrawer(): void {
    this.toggleDrawerEmitter.emit();
  }
}
