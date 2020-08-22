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
}

export interface ITimetable {
    slots: Array<Slot>;
    type: string;
}
