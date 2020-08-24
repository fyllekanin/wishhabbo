import { InternalRequest } from '../utilities/internal.request';
import { SlimUserView } from './respond-views/user/slim-user.view';
import { EventEntity } from '../persistance/entities/staff/event.entity';
import { IPayload } from './payloads/payload.interface';

export class TimetableSlot implements IPayload {
    private readonly timetableId: number;
    private readonly user: SlimUserView;
    private readonly day: number;
    private readonly hour: number;
    private readonly event: EventEntity;
    private readonly isBooked: boolean;
    private readonly isCurrentSlot: boolean;
    private readonly isRadio: boolean;

    constructor (
        timetableId: number,
        user: SlimUserView,
        day: number,
        hour: number,
        event: EventEntity,
        isBooked: boolean,
        isCurrentSlot: boolean,
        isRadio: boolean
    ) {
        this.timetableId = timetableId;
        this.user = user;
        this.day = day;
        this.hour = hour;
        this.event = event;
        this.isBooked = isBooked;
        this.isCurrentSlot = isCurrentSlot;
        this.isRadio = isRadio;
    }

    getTimetableId (): number {
        return this.timetableId;
    }

    getUser (): SlimUserView {
        return this.user;
    }

    getDay (): number {
        return this.day;
    }

    getHour (): number {
        return this.hour;
    }

    getEvent (): EventEntity {
        return this.event;
    }

    getIsBooked (): boolean {
        return this.isBooked;
    }

    getIsCurrentSlot (): boolean {
        return this.isCurrentSlot;
    }

    getIsRadio (): boolean {
        return this.isRadio;
    }

    static of (req: InternalRequest, isRadio: boolean, timetableId: number): TimetableSlot {
        const {
            user,
            day,
            hour,
            event,
            isBooked,
            isCurrentSlot
        } = req.body;
        return new TimetableSlot(
            timetableId,
            user,
            day,
            hour,
            event,
            isBooked,
            isCurrentSlot,
            isRadio
        );
    }

    static newBuilder (): TimetableSlotBuilder {
        return new TimetableSlotBuilder();
    }
}

class TimetableSlotBuilder {
    timetableId: number;
    user: SlimUserView;
    day: number;
    hour: number;
    event: EventEntity;
    isBooked: boolean;
    isCurrentSlot: boolean;

    withTimetableId (timetableId: number): TimetableSlotBuilder {
        this.timetableId = timetableId;
        return this;
    }

    withUser (user: SlimUserView): TimetableSlotBuilder {
        this.user = user;
        return this;
    }

    withDay (day: number): TimetableSlotBuilder {
        this.day = day;
        return this;
    }

    withHour (hour: number): TimetableSlotBuilder {
        this.hour = hour;
        return this;
    }

    withEvent (event: EventEntity): TimetableSlotBuilder {
        this.event = event;
        return this;
    }

    withIsBooked (isBooked: boolean): TimetableSlotBuilder {
        this.isBooked = isBooked;
        return this;
    }

    withIsCurrentSlot (isCurrentSlot: boolean): TimetableSlotBuilder {
        this.isCurrentSlot = isCurrentSlot;
        return this;
    }

    build (): TimetableSlot {
        return new TimetableSlot(
            this.timetableId,
            this.user,
            this.day,
            this.hour,
            this.event,
            this.isBooked,
            this.isCurrentSlot,
            null
        );
    }
}
