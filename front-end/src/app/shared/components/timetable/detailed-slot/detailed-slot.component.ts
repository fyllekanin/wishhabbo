import { Component } from '@angular/core';
import { Slot, TimetableEvent } from '../timetable.interface';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-timetable-detailed-slot',
    templateUrl: 'detailed-slot.component.html',
    styleUrls: [ 'detailed-slot.component.css' ]
})
export class DetailedSlotComponent {
    slot: Slot;
    isRadio: boolean;
    events: Array<TimetableEvent> = [];
    event: TimetableEvent;
    username: string;

    isBookingForEnabled = false;

    constructor (private authService: AuthService) {
    }

    setup (slot: Slot, events: Array<TimetableEvent>, isRadio: boolean): void {
        this.slot = slot;
        this.event = this.slot.event;
        this.events = events;
        this.isRadio = isRadio;
        this.isBookingForEnabled = this.isRadio ?
            this.authService.getAuthUser().staffPermissions.canUnbookOthersRadio :
            this.authService.getAuthUser().staffPermissions.canUnbookOthersEvents;
    }

    getEvent (): TimetableEvent {
        return this.event;
    }

    getBookFor (): string {
        return this.username;
    }
}
