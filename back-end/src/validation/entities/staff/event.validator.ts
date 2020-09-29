import { EntityValidator } from '../entity-validator.interface';
import { ValidationError } from '../../validation.error';
import { IEntity } from '../../../persistance/entities/entity.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { EventEntity } from '../../../persistance/entities/staff/event.entity';
import { EventsRepository } from '../../../persistance/repositories/staff/events.repository';
import { ErrorCodes } from '../../error.codes';
import { PaginationWhereOperators } from '../../../persistance/repositories/base.repository';

export class EventValidator implements EntityValidator<EventEntity> {

    async validate (entity: IEntity, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const eventEntity = entity as EventEntity;
        const errors: Array<ValidationError> = [];

        await this.validateExistingName(eventEntity, errors, serviceConfig.eventsRepository);

        return errors;
    }

    isValidEntity (entity: IEntity): boolean {
        return entity instanceof EventEntity;
    }

    private async validateExistingName (entity: EventEntity, errors: Array<ValidationError>,
                                        eventsRepository: EventsRepository): Promise<void> {
        const items = await eventsRepository.paginate({
            page: 1,
            take: 1,
            where: [
                { key: 'name', operator: PaginationWhereOperators.EQUALS, value: entity.name }
            ]
        });
        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EVENT_ALREADY_EXISTS.code)
                .withField('name')
                .withMessage(ErrorCodes.EVENT_ALREADY_EXISTS.description)
                .build());
        }
    }
}
