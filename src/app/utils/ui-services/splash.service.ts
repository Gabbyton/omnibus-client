import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SplashService {
    showSplash: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    show(): void {
        this.showSplash.next(true);
    }

    hide(): void {
        this.showSplash.next(false);
    }
}