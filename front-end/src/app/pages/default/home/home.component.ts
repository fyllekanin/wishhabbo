import { Component } from '@angular/core';
import { HomeModel } from './home.model';
import { ActivatedRoute } from '@angular/router';
import { Slot } from '../../../shared/components/timetable/timetable.interface';
import { TimeHelper } from '../../../shared/helpers/time.helper';

@Component({
    selector: 'app-default-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent {
    data = new HomeModel();
    slots: Array<Slot> = [];

    constructor (activatedRoute: ActivatedRoute) {
        this.data = activatedRoute.snapshot.data.data;
        this.slots = this.getTimeConvertedSlots(this.data.todayEvents);
    }

    private getTimeConvertedSlots (slots: Array<Slot>): Array<Slot> {
        const hours = TimeHelper.getHours();
        return slots.map(slot => {
            const copy = { ...slot };

            const offsetInHours = copy.hour + TimeHelper.getTimeOffsetInHours();
            copy.hour = TimeHelper.getConvertedHour(offsetInHours);
            copy.day = TimeHelper.getConvertedDay(offsetInHours, slot.day);
            copy.displayHour = hours.find(hour => hour.number === copy.hour).label;

            return copy;
        });
    }
}
