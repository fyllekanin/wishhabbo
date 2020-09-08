import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { UserDetailsPayload } from '../../../rest-service-views/payloads/admin/users/user-details.payload';
import { ErrorCodes } from '../../error.codes';
import { RegexConstants } from '../../../constants/regex.constants';

export class UserDetailsPayloadValidator implements PayloadValidator<UserDetailsPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const userDetails = payload as UserDetailsPayload;
        const errors: Array<ValidationError> = [];

        await this.validateValidUsername(userDetails, serviceConfig, errors);
        await this.validateValidPassword(userDetails, errors);
        await this.validateValidHabbo(userDetails, serviceConfig, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof UserDetailsPayload;
    }

    private async validateValidUsername (userDetails: UserDetailsPayload, serviceConfig: ServiceConfig,
                                         errors: Array<ValidationError>): Promise<void> {
        if (!userDetails.getUsername() || !userDetails.getUsername().match(RegexConstants.VALID_USERNAME)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.INVALID_USERNAME.description)
                .build());
            return;
        }

        const user = await serviceConfig.userRepository.getUserWithUsername(userDetails.getUsername());
        if (user && user.userId !== userDetails.getUserId()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EXISTING_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.EXISTING_USERNAME.description)
                .build());
        }
    }

    private async validateValidPassword (userDetails: UserDetailsPayload, errors: Array<ValidationError>): Promise<void> {
        if (!userDetails.getPassword()) {
            return;
        }
        if (!userDetails.getPassword().match(RegexConstants.VALID_PASSWORD)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_PASSWORD.code)
                .withField('password')
                .withMessage(ErrorCodes.INVALID_PASSWORD.description)
                .build());
            return;
        }

        if (!userDetails.getRepassword() || userDetails.getPassword() !== userDetails.getRepassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_CONFIRMED_PASSWORD.code)
                .withField('repassword')
                .withMessage(ErrorCodes.INVALID_CONFIRMED_PASSWORD.description)
                .build());
        }
    }

    private async validateValidHabbo (userDetails: UserDetailsPayload, serviceConfig: ServiceConfig,
                                      errors: Array<ValidationError>): Promise<void> {
        const existingUserWithHabbo = await serviceConfig.userRepository.getUserWithHabbo(userDetails.getHabbo());
        if (existingUserWithHabbo && existingUserWithHabbo.userId !== userDetails.getUserId()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.USER_WITH_HABBO_EXISTS.code)
                .withField('habbo')
                .withMessage(ErrorCodes.USER_WITH_HABBO_EXISTS.description)
                .build());
        }
    }
}
