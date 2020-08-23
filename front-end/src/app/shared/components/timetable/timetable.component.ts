import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITimetable, Slot, TimeTableTypes } from './timetable.interface';
import { UnSub } from '../../decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { TimetableService } from './timetable.service';
import { TimeHelper } from '../../helpers/time.helper';
import { UserAction } from '../../constants/common.interfaces';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-timetable',
    templateUrl: 'timetable.component.html',
    styleUrls: [ 'timetable.component.css' ]
})
@UnSub()
export class TimetableComponent implements OnDestroy {
    private type: string;
    private day: number;

    subscriptions: Array<Unsubscribable> = [];
    title: string;
    data: ITimetable;

    actions: Array<UserAction> = [];

    constructor (
        private authService: AuthService,
        private service: TimetableService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.type = activatedRoute.snapshot.data.type;
        this.day = Number(activatedRoute.snapshot.params.day);
        this.subscriptions.push(activatedRoute.params.subscribe(async data => {
            this.day = Number(data.day);
            await this.doSetup();
        }));
        this.subscriptions.push(activatedRoute.data.subscribe(async data => {
            this.type = data.type;
            await this.doSetup();
        }));
    }

    onDaySwitch (action: UserAction): void {
        this.router.navigateByUrl(`/staff/radio/timetable/${action.value}`);
    }

    async clickHour (slot: Slot): Promise<void> {
        if (!slot.isBooked) {
            await this.doBooking(slot);
            return;
        }

        if ((this.authService.getAuthUser().staffPermissions.canUnbookOthersRadio && this.isRadio()) ||
            this.authService.getAuthUser().staffPermissions.canUnbookOthersEvents && !this.isRadio()) {
            await this.doEdit(slot);
        } else {
            await this.service.unbook(slot, this.isRadio());
        }
    }

    ngOnDestroy (): void {
        // Empty
    }

    private async doEdit (slot: Slot): Promise<void> {
        const result = await this.service.doOpenDetails(slot, true, this.isRadio());
        if (!result.proceed) {
            return;
        }
        slot.event = result.event;
        await this.service.edit(slot, this.isRadio());
        await this.doSetup();
    }

    private async doBooking (slot: Slot): Promise<void> {
        const result = await this.service.doOpenDetails(slot, false, this.isRadio());
        if (!result.proceed) {
            return;
        }
        slot.event = result.event;
        await this.service.book(slot, this.isRadio());
        await this.doSetup();
    }

    private async doSetup (): Promise<void> {
        this.title = this.isRadio() ? 'Radio Timetable' : 'Events Timetable';

        const slots = await this.service.fetchSlots(this.type);
        this.data = this.getDataWithCurrentSlots(slots);
        this.actions = [
            { label: 'Mon', value: 1, isActive: this.day === 1 },
            { label: 'Tue', value: 2, isActive: this.day === 2 },
            { label: 'Wed', value: 3, isActive: this.day === 3 },
            { label: 'Thu', value: 4, isActive: this.day === 4 },
            { label: 'Fri', value: 5, isActive: this.day === 5 },
            { label: 'Sat', value: 6, isActive: this.day === 6 },
            { label: 'Sun', value: 7, isActive: this.day === 7 }
        ];
    }

    private getDataWithCurrentSlots (data: ITimetable): ITimetable {
        const offset = TimeHelper.getTimeOffsetInHours();
        data.current = data.all.map(item => {
            const copy = { ...item };
            const convertedHour = TimeHelper.getConvertedHour(copy.hour + offset);
            copy.hour = convertedHour;
            copy.day = TimeHelper.getConvertedDay(convertedHour, copy.day);
            return copy;
        }).filter(item => item.day === this.day);
        return data;
    }

    private isRadio (): boolean {
        return this.type === TimeTableTypes.RADIO;
    }
}
