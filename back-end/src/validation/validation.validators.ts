import { ValidationError } from './validation.error';
import { UserValidation } from './entities/user/user.validator';
import { RegisterPayloadValidator } from './payloads/user/register-payload.validator';
import { EntityValidator } from './entities/entity-validator.interface';
import { IEntity } from '../persistance/entities/entity.interface';
import { PayloadValidator } from './payloads/payload-validator.interface';
import { IPayload } from '../rest-service-views/payloads/payload.interface';
import { LoginPayloadValidator } from './payloads/user/login-payload.validator';
import { ArticlePayloadValidator } from './payloads/staff/article-payload.validator';
import { InternalRequest, ServiceConfig } from '../utilities/internal.request';
import { TimetableSlotPayloadValidator } from './payloads/staff/timetable-slot-payload.validator';
import { EventValidator } from './entities/staff/event.validator';
import { GroupPayloadValidator } from './payloads/admin/group-payload.validator';

export class ValidationValidators {
    private static readonly ENTITY_VALIDATORS: Array<EntityValidator<IEntity>> = [
        new UserValidation(),
        new EventValidator()
    ];

    private static readonly PAYLOAD_VALIDATORS: Array<PayloadValidator<IPayload>> = [
        new RegisterPayloadValidator(),
        new LoginPayloadValidator(),
        new ArticlePayloadValidator(),
        new TimetableSlotPayloadValidator(),
        new GroupPayloadValidator()
    ];

    static async validateEntity<T> (entity: T, serviceConfig: ServiceConfig, req: InternalRequest): Promise<Array<ValidationError>> {
        const validValidators = ValidationValidators.ENTITY_VALIDATORS.filter(validator => validator.isValidEntity(entity));
        const promises: Array<Promise<Array<ValidationError>>> = [];
        validValidators.forEach(validator => {
            promises.push(validator.validate(entity, serviceConfig, req.user));
        });

        return Promise.all(promises).then(errorLists => {
            return errorLists.reduce((prev, curr) => {
                return prev.concat(curr);
            }, []);
        });
    }

    static async validatePayload<T> (payload: T, serviceConfig: ServiceConfig, req: InternalRequest): Promise<Array<ValidationError>> {
        const validValidators = ValidationValidators.PAYLOAD_VALIDATORS.filter(validator => validator.isValidEntity(payload));
        const promises: Array<Promise<Array<ValidationError>>> = [];
        validValidators.forEach(validator => {
            promises.push(validator.validate(payload, serviceConfig, req.user));
        });

        return Promise.all(promises).then(errorLists => {
            return errorLists.reduce((prev, curr) => {
                return prev.concat(curr);
            }, []);
        });
    }
}
