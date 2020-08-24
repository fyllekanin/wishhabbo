import { ValidationError } from '../validation.error';
import { IPayload } from '../../rest-service-views/payloads/payload.interface';
import { ServiceConfig } from '../../utilities/internal.request';
import { UserEntity } from '../../persistance/entities/user/user.entity';

export interface PayloadValidator<T extends IPayload> {

    isValidEntity (payload: T): boolean;

    validate (payload: T, serviceConfig: ServiceConfig, user: UserEntity): Promise<Array<ValidationError>>;
}
