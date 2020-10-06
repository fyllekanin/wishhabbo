import { PayloadValidator } from '../payload-validator.interface';
import { ChangePasswordPayload } from '../../../rest-service-views/payloads/user/change-password.payload';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { ValidationError } from '../../validation.error';
import { RegexConstants } from '../../../constants/regex.constants';
import { ErrorCodes } from '../../error.codes';
import { HabboService } from '../../../external/services/habbo.service';

export class ChangePasswordPayloadValidator implements PayloadValidator<ChangePasswordPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const changePasswordPayload = payload as ChangePasswordPayload;
        const errors: Array<ValidationError> = [];

        this.validateInvalidPassword(changePasswordPayload, errors);
        this.validateConfirmedPassword(changePasswordPayload, errors);
        await this.validateHabboMotto(serviceConfig, user.userId, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof ChangePasswordPayload;
    }

    private async validateHabboMotto (serviceConfig: ServiceConfig, userId: number, errors: Array<ValidationError>): Promise<void> {
        const habboService = new HabboService();
        const user = await serviceConfig.userRepository.getUserById(userId);
        const habbo = await habboService.getHabbo(user.habbo);
        if (!habbo || habbo.getMotto() !== `wishhabbo-${userId}`) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_MOTTO_INCORRECT.code)
                .withField('motto')
                .withMessage(ErrorCodes.HABBO_MOTTO_INCORRECT.description)
                .build());
        }
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
