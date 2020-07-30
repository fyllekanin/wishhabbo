import { ValidationError } from '../validation.error';
import { IPayload } from '../../rest-service-views/payloads/payload.interface';

export interface PayloadValidator<T extends IPayload> {

    isValidEntity (payload: T): boolean;

    validate (payload: T): Promise<Array<ValidationError>>;
}
