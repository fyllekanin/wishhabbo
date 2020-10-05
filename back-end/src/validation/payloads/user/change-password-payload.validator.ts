import { PayloadValidator } from '../payload-validator.interface';
import { ChangePasswordPayload } from '../../../rest-service-views/payloads/user/change-password.payload';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { ValidationError } from '../../validation.error';
import { RegexConstants } from '../../../constants/regex.constants';
import { ErrorCodes } from '../../error.codes';

export class ChangePasswordPayloadValidator implements PayloadValidator<ChangePasswordPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const changePasswordPayload = payload as ChangePasswordPayload;
        const errors: Array<ValidationError> = [];

        this.validateInvalidPassword(changePasswordPayload, errors);
        this.validateConfirmedPassword(changePasswordPayload, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof ChangePasswordPayload;
    }

    private validateInvalidPassword (changePasswordPayload: ChangePasswordPayload, errors: Array<ValidationError>): void {
        if (!changePasswordPayload.getPassword() || !changePasswordPayload.getPassword().match(RegexConstants.VALID_PASSWORD)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_PASSWORD.code)
                .withField('password')
                .withMessage(ErrorCodes.INVALID_PASSWORD.description)
                .build());
        }
    }

    private validateConfirmedPassword (changePasswordPayload: ChangePasswordPayload, errors: Array<ValidationError>): void {
        if (!changePasswordPayload.getRepassword() || changePasswordPayload.getPassword() !== changePasswordPayload.getRepassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_CONFIRMED_PASSWORD.code)
                .withField('repassword')
                .withMessage(ErrorCodes.INVALID_CONFIRMED_PASSWORD.description)
                .build());
        }
    }
}
