import { SlimUser } from '../../classes/slim-user.class';
import { arrayOf, ClassHelper, objectOf, primitiveOf } from '../../helpers/class.helper';

export enum TimeTableTypes {
    EVENTS = 'events',
    RADIO = 'radio'
}

export class TimetableEvent {
    @primitiveOf(Number)
    eventId: number;
    @primitiveOf(String)
    name: string;
    @primitiveOf(Number)
    createdAt: number;
    @primitiveOf(Number)
    updatedAt: number;

    constructor (source: Partial<TimetableEvent>) {
        ClassHelper.assign(this, source);
    }
}

export class BookingResult {
    @primitiveOf(Boolean)
    proceed: boolean;
    @objectOf(TimetableEvent)
    event: TimetableEvent;
    @primitiveOf(String)
    username: string;
    @primitiveOf(Boolean)
    isUnbooking: boolean;

    constructor (source: Partial<BookingResult>) {
        ClassHelper.assign(this, source);
    }
}

export class Slot {
    @primitiveOf(Number)
    timetableId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitiveOf(Number)
    day: number;
    @primitiveOf(Number)
    hour: number;
    @objectOf(TimetableEvent)
    event: TimetableEvent;
    @primitiveOf(Boolean)
    isBooked: boolean;
    @primitiveOf(Boolean)
    isCurrentSlot: boolean;

    displayHour: string;

    constructor (source: Partial<Slot>) {
        ClassHelper.assign(this, source);
    }
}

export class Timetable {
    @arrayOf(Slot)
    current: Array<Slot>;
    @arrayOf(Slot)
    all: Array<Slot>;
    @primitiveOf(String)
    type: string;

    constructor (source: Partial<Timetable>) {
        ClassHelper.assign(this, source);
    }

}
