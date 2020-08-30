import { TimetableEntity } from '../../persistance/entities/staff/timetable.entity';
import { TimetableSlot } from '../../rest-service-views/timetable.slot';
import { InternalRequest } from '../../utilities/internal.request';

export class TimetableController {

    protected async getConvertedSlots (req: InternalRequest, slots: Array<TimetableEntity>): Promise<Array<TimetableSlot>> {
        const items: Array<TimetableSlot> = [];
        const currentDay = new Date().getUTCDay() + 1;
        const currentHour = new Date().getUTCHours();

        for (let d = 1; d < 8; d++) {
            for (let h = 0; h < 24; h++) {
                const slot = slots.find(item => item.day === d && item.hour === h);
                const user = slot ? await req.serviceConfig.userRepository.getSlimUserById(slot.userId) : null;
                const event = slot ? await req.serviceConfig.eventsRepository.get(slot.eventId) : null;
                items.push(TimetableSlot.newBuilder()
                    .withTimetableId(slot ? slot.timetableId : null)
                    .withDay(d)
                    .withHour(h)
                    .withEvent(event)
                    .withIsBooked(Boolean(slot))
                    .withIsCurrentSlot(d === currentDay && h === currentHour)
                    .withUser(user)
                    .build());
            }
        }
        return items;
    }
}
