import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ServiceConfig } from '../../../utilities/internal.request';
import { TimetableSlot } from '../../../rest-service-views/timetable.slot';
import { TimetableType } from '../../../persistance/entities/staff/timetable.entity';
import { ErrorCodes } from '../../error.codes';
import { UserEntity } from '../../../persistance/entities/user/user.entity';
import { PayloadValidator } from '../payload-validator.interface';
import { Permissions } from '../../../constants/permissions.constant';

export class TimetableSlotPayloadValidator implements PayloadValidator<TimetableSlot> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: UserEntity): Promise<Array<ValidationError>> {
        const timetableSlot = payload as TimetableSlot;
        const errors: Array<ValidationError> = [];

        await this.validateAvailableSlot(timetableSlot, serviceConfig, errors);
        await this.validateBookForUser(user, timetableSlot, serviceConfig, errors);
        await this.validateBookedEvent(timetableSlot, serviceConfig, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof TimetableSlot;
    }

    private async validateBookedEvent (timetableSlot: TimetableSlot, serviceConfig: ServiceConfig,
                                       errors: Array<ValidationError>): Promise<void> {
        if (timetableSlot.getIsRadio()) {
            return;
        }
        const entity = timetableSlot.getEvent() ? await serviceConfig.eventsRepository.get(timetableSlot.getEvent().eventId) : null;
        if (!entity) {
            errors.push(ValidationError.newBuilder()
                .withField('event')
                .withCode(ErrorCodes.INVALID_EVENT.code)
                .withMessage(ErrorCodes.INVALID_EVENT.description)
                .build());
        }
    }

    private async validateBookForUser (user: UserEntity, timetableSlot: TimetableSlot, serviceConfig: ServiceConfig,
                                       errors: Array<ValidationError>): Promise<void> {
        if (!timetableSlot.getUser() || !timetableSlot.getUser().getUsername()) {
            return;
        }

        const canBookForOther = timetableSlot.getIsRadio() ?
            await serviceConfig.groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO) :
            await serviceConfig.groupRepository.haveStaffPermission(user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_EVENTS);
        if (!canBookForOther) {
            errors.push(ValidationError.newBuilder()
                .withField('user')
                .withCode(ErrorCodes.CAN_NOT_BOOK_FOR_OTHERS.code)
                .withMessage(ErrorCodes.CAN_NOT_BOOK_FOR_OTHERS.description)
                .build());
            return;
        }

        const items = await serviceConfig.userRepository.paginate({
            page: 1,
            take: 1,
            where: [
                { key: 'username', operator: '=', value: timetableSlot.getUser().getUsername() }
            ]
        });

        if (items.getItems().length === 0) {
            errors.push(ValidationError.newBuilder()
                .withField('user')
                .withCode(ErrorCodes.NO_USER_WITH_USERNAME.code)
                .withMessage(ErrorCodes.NO_USER_WITH_USERNAME.description)
                .build());
        }
    }

    private async validateAvailableSlot (timetableSlot: TimetableSlot, serviceConfig: ServiceConfig,
                                         errors: Array<ValidationError>): Promise<void> {
        const type = timetableSlot.getIsRadio() ? TimetableType.RADIO : TimetableType.EVENTS;
        const items = await serviceConfig.timetableRepository.paginate({
            page: 1,
            take: 1,
            where: [
                { key: 'isArchived', operator: '=', value: 0 },
                { key: 'day', operator: '=', value: timetableSlot.getDay() },
                { key: 'hour', operator: '=', value: timetableSlot.getHour() },
                { key: 'type', operator: '=', value: type },
                { key: 'timetableId', operator: '!=', value: timetableSlot.getTimetableId() }
            ]
        });

        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withField('time')
                .withCode(ErrorCodes.ALREADY_TAKEN_SLOT.code)
                .withMessage(ErrorCodes.ALREADY_TAKEN_SLOT.description)
                .build());
        }
    }
}
