import { ValidationError } from '../validation.error';
import { IPayload } from '../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../utilities/internal.request';

export interface PayloadValidator<T extends IPayload> {

    isValidEntity (payload: T): boolean;

    validate (payload: T, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>>;
}
