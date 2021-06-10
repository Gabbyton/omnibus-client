import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DrawerService {
    toggleDrawerEmitter: EventEmitter<void> = new EventEmitter();

    toggleDrawer(): void {
        this.toggleDrawerEmitter.emit();
    }
}