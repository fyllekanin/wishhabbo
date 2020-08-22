import { SlimUser } from '../../classes/slim-user.class';

export const TimeTableTypes = {
    EVENTS: 'events',
    RADIO: 'radio'
};

export interface Slot {
    user: SlimUser;
    day: number;
    hour: number;
    event: string;
    isBooked: boolean;
    isCurrentSlot: boolean;
}

export interface ITimetable {
    current: Array<Slot>;
    all: Array<Slot>;
    type: string;
}
