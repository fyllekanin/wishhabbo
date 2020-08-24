import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ErrorCodes } from '../../error.codes';
import { LoginPayload } from '../../../rest-service-views/payloads/auth/login.payload';
import { ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { UserEntity } from '../../../persistance/entities/user/user.entity';

export class LoginPayloadValidator implements PayloadValidator<LoginPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: UserEntity): Promise<Array<ValidationError>> {
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
