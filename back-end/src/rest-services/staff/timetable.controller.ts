import { TimetableEntity } from '../../persistance/entities/staff/timetable.entity';
import { TimetableSlot } from '../../rest-service-views/two-way/staff/timetable.slot';
import { InternalRequest } from '../../utilities/internal.request';
import { TimeUtility } from '../../utilities/time.utility';
import { ValidationValidators } from '../../validation/validation.validators';

export class TimetableController {

    protected async doUpdateSlot (req: InternalRequest, entity: TimetableEntity, isRadio: boolean)
        : Promise<{ original: TimetableEntity, updated: TimetableEntity, errors: Array<ValidationValidators> }> {
        const slot = TimetableSlot.of(req, isRadio, entity.timetableId);
        const errors = await ValidationValidators.validatePayload(slot, req.serviceConfig, req.user);
        if (errors.length > 0) {
            return {
                original: null,
                updated: null,
                errors: errors
            };
        }

        const copy = entity.newBuilderFromCurrent().build();
        const user = slot.getUser() && slot.getUser().getUsername() ?
            await req.serviceConfig.userRepository.getUserWithUsername(slot.getUser().getUsername()) : null;
        entity.eventId = isRadio ? null : slot.getEvent().eventId;
        entity.userId = user ? user.userId : entity.userId;
        const updatedEntity = await req.serviceConfig.timetableRepository.save(entity);

        return {
            original: copy,
            updated: updatedEntity,
            errors: []
        };
    }

    protected async getConvertedSlots (req: InternalRequest, slots: Array<TimetableEntity>): Promise<Array<TimetableSlot>> {
        const items: Array<TimetableSlot> = [];
        const currentDay = TimeUtility.getCurrentDay();
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
