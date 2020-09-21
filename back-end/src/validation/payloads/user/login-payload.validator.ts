import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ErrorCodes } from '../../error.codes';
import { LoginPayload } from '../../../rest-service-views/payloads/auth/login.payload';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';

export class LoginPayloadValidator implements PayloadValidator<LoginPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const loginPayload = payload as LoginPayload;
        const errors: Array<ValidationError> = [];

        this.validateEmptyUsername(loginPayload, errors);
        this.validateEmptyPassword(loginPayload, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof LoginPayload;
    }

    private validateEmptyUsername (loginPayload: LoginPayload, errors: Array<ValidationError>): void {
        if (!loginPayload.getUsername()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .withField('username')
                .build());
        }
    }

    private validateEmptyPassword (loginPayload: LoginPayload, errors: Array<ValidationError>): void {
        if (!loginPayload.getPassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .withField('password')
                .build());
        }
    }
}
