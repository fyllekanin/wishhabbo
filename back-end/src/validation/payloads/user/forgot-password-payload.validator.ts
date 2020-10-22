import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ErrorCodes } from '../../error.codes';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { ForgotPasswordPayload } from '../../../rest-service-views/payloads/auth/forgot-password.payload';
import { RegexConstants } from '../../../constants/regex.constants';
import { HabboService } from '../../../external/services/habbo.service';
import { TimeUtility } from '../../../utilities/time.utility';

export class ForgotPasswordPayloadValidator implements PayloadValidator<ForgotPasswordPayload> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const forgotPasswordPayload = payload as ForgotPasswordPayload;
        const errors: Array<ValidationError> = [];

        await this.validateThatUserExists(forgotPasswordPayload, serviceConfig, errors);
        await this.validatePassword(forgotPasswordPayload, errors);
        await this.validateHabboMotto(forgotPasswordPayload, serviceConfig, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof ForgotPasswordPayload;
    }

    private async validateThatUserExists (payload: ForgotPasswordPayload, serviceConfig: ServiceConfig,
                                          errors: Array<ValidationError>): Promise<void> {
        const user = await serviceConfig.userRepository.getUserWithUsername(payload.getUsername());
        if (!user) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.NO_USER_WITH_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.NO_USER_WITH_USERNAME.description)
                .build());
        }
    }

    private async validatePassword (payload: ForgotPasswordPayload, errors: Array<ValidationError>): Promise<void> {
        if (!payload.getPassword() || !payload.getRepassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('password')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
            return;
        }
        if (!payload.getPassword().match(RegexConstants.VALID_PASSWORD)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_PASSWORD.code)
                .withField('password')
                .withMessage(ErrorCodes.INVALID_PASSWORD.description)
                .build());
        }
        if (payload.getPassword() !== payload.getRepassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_CONFIRMED_PASSWORD.code)
                .withField('repassword')
                .withMessage(ErrorCodes.INVALID_CONFIRMED_PASSWORD.description)
                .build());
        }
    }

    private async validateHabboMotto (payload: ForgotPasswordPayload, serviceConfig: ServiceConfig, errors: Array<ValidationError>): Promise<void> {
        const habboService = new HabboService();
        const user = await serviceConfig.userRepository.getUserWithUsername(payload.getUsername());
        if (!user) {
            return;
        }

        const habbo = await habboService.getHabbo(user.habbo);
        if (!habbo.getMotto() || !habbo.getMotto().includes('-')) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_MOTTO_INCORRECT.code)
                .withField('motto')
                .withMessage(ErrorCodes.HABBO_MOTTO_INCORRECT.description)
                .build());
            return;
        }
        const timestamp = Number(habbo.getMotto().split('-')[1]);
        if (!timestamp || !Number.isInteger(timestamp) || TimeUtility.getCurrentTime() > (timestamp + 3600)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.MOTTO_EXPIRES.code)
                .withField('motto')
                .withMessage(ErrorCodes.MOTTO_EXPIRES.description)
                .build());
        }
    }
}
