import { TimetableEntity } from '../../persistance/entities/staff/timetable.entity';
import { TimetableSlot } from '../../rest-service-views/two-way/staff/timetable.slot';
import { InternalRequest } from '../../utilities/internal.request';
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
}
