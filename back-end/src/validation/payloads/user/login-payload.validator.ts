import { ValidationError } from '../../validation.error';
import { EntityValidator } from '../../entities/entity-validator.interface';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ErrorCodes } from '../../error.codes';
import { LoginPayload } from '../../../rest-service-views/payloads/auth/login.payload';

export class LoginPayloadValidator implements EntityValidator<LoginPayload> {

    async validate (payload: IPayload): Promise<Array<ValidationError>> {
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
                .withCode(ErrorCodes.EMPTY_USERNAME.code)
                .withMessage(ErrorCodes.EMPTY_USERNAME.description)
                .withField('username')
                .build());
        }
    }

    private validateEmptyPassword (loginPayload: LoginPayload, errors: Array<ValidationError>): void {
        if (!loginPayload.getPassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_PASSWORD.code)
                .withMessage(ErrorCodes.EMPTY_PASSWORD.description)
                .withField('password')
                .build());
        }
    }
}
