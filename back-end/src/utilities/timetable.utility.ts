import { TimetableSlot } from '../rest-service-views/two-way/staff/timetable.slot';
import { TimetableEntity } from '../persistance/entities/staff/timetable.entity';
import { InternalRequest } from './internal.request';
import { TimeUtility } from './time.utility';

export class TimetableUtility {

    static async getConvertedSlots (req: InternalRequest, slots: Array<TimetableEntity>): Promise<Array<TimetableSlot>> {
        const items: Array<TimetableSlot> = [];
        for (let d = 1; d < 8; d++) {
            for (let h = 0; h < 24; h++) {
                const slot = slots.find(item => item.day === d && item.hour === h);
                items.push(await TimetableUtility.getConveredSlot(req, slot, d, h));
            }
        }
        return items;
    }

    static async getConveredSlot (req: InternalRequest, slot: TimetableEntity, day: number, hour: number): Promise<TimetableSlot> {
        const currentDay = TimeUtility.getCurrentDay();
        const currentHour = TimeUtility.getCurrentHour();

        const user = slot ? await req.serviceConfig.userRepository.getSlimUserById(slot.userId) : null;
        const event = slot ? await req.serviceConfig.eventsRepository.get(slot.eventId) : null;
        return TimetableSlot.newBuilder()
            .withTimetableId(slot ? slot.timetableId : null)
            .withDay(day)
            .withHour(hour)
            .withEvent(event)
            .withIsBooked(Boolean(slot))
            .withIsCurrentSlot(day === currentDay && hour === currentHour)
            .withUser(user)
            .build();
    }
}
