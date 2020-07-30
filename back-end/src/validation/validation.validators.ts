import { ValidationError } from './validation.error';
import { UserValidation } from './entities/user/user.validator';
import { RegisterPayloadValidator } from './payloads/register-payload.validator';
import { EntityValidator } from './entities/entity-validator.interface';
import { IEntity } from '../persistance/entities/entity.interface';
import { PayloadValidator } from './payloads/payload-validator.interface';
import { IPayload } from '../rest-service-views/payloads/payload.interface';
import { LoginPayloadValidator } from './payloads/login-payload.validator';

export class ValidationValidators {
    private static readonly ENTITY_VALIDATORS: Array<EntityValidator<IEntity>> = [
        new UserValidation()
    ];

    private static readonly PAYLOAD_VALIDATORS: Array<PayloadValidator<IPayload>> = [
        new RegisterPayloadValidator(),
        new LoginPayloadValidator()
    ];

    static async validateEntity<T> (entity: T): Promise<Array<ValidationError>> {
        const validValidators = ValidationValidators.ENTITY_VALIDATORS.filter(validator => validator.isValidEntity(entity));
        const promises: Array<Promise<Array<ValidationError>>> = [];
        validValidators.forEach(validator => {
            promises.push(validator.validate(entity));
        });

        return Promise.all(promises).then(errorLists => {
            return errorLists.reduce((prev, curr) => {
                return prev.concat(curr);
            }, []);
        });
    }

    static async validatePayload<T> (payload: T): Promise<Array<ValidationError>> {
        const validValidators = ValidationValidators.PAYLOAD_VALIDATORS.filter(validator => validator.isValidEntity(payload));
        const promises: Array<Promise<Array<ValidationError>>> = [];
        validValidators.forEach(validator => {
            promises.push(validator.validate(payload));
        });

        return Promise.all(promises).then(errorLists => {
            return errorLists.reduce((prev, curr) => {
                return prev.concat(curr);
            }, []);
        });
    }
}
