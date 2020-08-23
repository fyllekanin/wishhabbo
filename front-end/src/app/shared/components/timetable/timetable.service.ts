import { ComponentRef, Injectable } from '@angular/core';
import { BookingResult, ITimetable, Slot, TimetableEvent } from './timetable.interface';
import { HttpService } from '../../../core/http/http.service';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { DialogService } from '../../../core/common-services/dialog.service';
import { take } from 'rxjs/operators';
import { TimeHelper } from '../../helpers/time.helper';
import { DetailedSlotComponent } from './detailed-slot/detailed-slot.component';
import { ButtonTypes, DialogButton } from '../../app-views/dialog/dialog.model';
import { SiteNotificationType } from '../../app-views/site-notification/site-notification.interface';

@Injectable()
export class TimetableService {
    private events: Array<TimetableEvent> = [];
    private bookingActions: Array<DialogButton> = [
        new DialogButton({ label: 'Cancel', action: 'cancel', type: ButtonTypes.GRAY }),
        new DialogButton({ label: 'Book', action: 'book', type: ButtonTypes.GREEN })
    ];
    private editingActions: Array<DialogButton> = [
        new DialogButton({ label: 'Cancel', action: 'cancel', type: ButtonTypes.GRAY }),
        new DialogButton({ label: 'Unbook', action: 'unbook', type: ButtonTypes.BLUE }),
        new DialogButton({ label: 'Save', action: 'book', type: ButtonTypes.GREEN })
    ];

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService,
        private dialogService: DialogService
    ) {
    }

    async doOpenDetails (slot: Slot, isEditing: boolean, isRadio: boolean): Promise<BookingResult> {
        const presentedHour = TimeHelper.getHours().find(hour => hour.number === slot.hour);
        const ref: ComponentRef<DetailedSlotComponent> = await this.dialogService.onComponentInstance.pipe(take(1)).toPromise();
        ref.instance.setup(slot, await this.getEvents(), isRadio);

        this.dialogService.open({
            title: `${isEditing ? 'Editing' : 'Booking'} ${TimeHelper.getDay(slot.day)} - ${presentedHour}`,
            component: DetailedSlotComponent,
            buttons: isEditing ? this.editingActions : this.bookingActions
        });
        const action = await this.dialogService.onAction.pipe(take(1)).toPromise();
        this.dialogService.close();

        return {
            proceed: action.action === 'book',
            event: ref.instance.getEvent(),
            username: ref.instance.getBookFor(),
            isUnbooking: action.action === 'unbook'
        };
    }

    async edit (slot: Slot, isRadio: boolean): Promise<unknown> {
        return this.httpService.put(`/staff/${isRadio ? 'radio' : 'events'}/${slot.timetableId}`, slot).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Slot updated',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }

    async book (slot: Slot, isRadio: boolean): Promise<unknown> {
        return this.httpService.post(`/staff/${isRadio ? 'radio' : 'events'}/book`, slot).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'Slot booked',
                    type: SiteNotificationType.SUCCESS
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }

    async unbook (slot: Slot, isRadio: boolean): Promise<unknown> {
        return new Promise(async res => {
            const presentedHour = TimeHelper.getHours().find(hour => hour.number === slot.hour);
            const result = await this.dialogService
                .confirm(`Do you really wanna unbook this slot on ${TimeHelper.getDay(slot.day)} - ${presentedHour}`);
            if (result) {
                await this.httpService.delete(`/staff/${isRadio ? 'radio' : 'events'}/unbook/${slot.timetableId}`).toPromise()
                    .then(() => {
                        this.siteNotificationService.create({
                            title: 'Success',
                            message: 'Slot unbooked',
                            type: SiteNotificationType.SUCCESS
                        });
                    })
                    .catch(error => this.siteNotificationService.onError(error.error));
            }
        });
    }

    fetchSlots (type: string): Promise<ITimetable> {
        return new Promise(res => {
            const all = [];

            for (let d = 1; d < 8; d++) {
                for (let i = 0; i < 24; i++) {
                    const random = Math.round(Math.random() * 10);
                    if (random % 3) {
                        all.push({
                            timetableId: Number(`${d}${i}`),
                            user: {
                                username: 'test #1'
                            },
                            day: d,
                            hour: i,
                            isBooked: true,
                            isCurrentSlot: false
                        });
                    } else {
                        all.push({
                            timetableId: Number(`${d}${i}`),
                            user: null,
                            day: d,
                            hour: i,
                            isBooked: false,
                            isCurrentSlot: false
                        });
                    }
                }
            }

            res({
                type: type,
                all: all,
                current: []
            });
        });
    }

    private async getEvents (): Promise<Array<TimetableEvent>> {
        if (this.events) {
            return this.events;
        }
        this.events = await this.httpService.get<Array<TimetableEvent>>('/staff/events/list').toPromise();
        return this.events;
    }
}
