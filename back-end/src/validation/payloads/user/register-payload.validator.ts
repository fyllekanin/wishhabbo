import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { RegisterPayload } from '../../../rest-service-views/payloads/auth/register.payload';
import { ErrorCodes } from '../../error.codes';
import { HabboService } from '../../../external/services/habbo.service';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { RegexConstants } from '../../../constants/regex.constants';
import { TimeUtility } from '../../../utilities/time.utility';

export class RegisterPayloadValidator implements PayloadValidator<RegisterPayload> {
    private static readonly ONE_WEEK = 604800;

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const registerPayload = payload as RegisterPayload;
        const errors: Array<ValidationError> = [];

        this.validateInvalidPassword(registerPayload, errors);
        this.validateConfirmedPassword(registerPayload, errors);
        await this.validateHabboMotto(registerPayload, errors, serviceConfig);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof RegisterPayload;
    }

    private async validateHabboMotto (registerPayload: RegisterPayload, errors: Array<ValidationError>,
                                      serviceConfig: ServiceConfig): Promise<void> {
        if (await serviceConfig.userRepository.getUserWithHabbo(registerPayload.getHabbo())) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.USER_WITH_HABBO_EXISTS.code)
                .withField('habbo')
                .withMessage(ErrorCodes.USER_WITH_HABBO_EXISTS.description)
                .build());
            return;
        }

        const habboService = new HabboService();
        const habbo = registerPayload.getHabbo() ? await habboService.getHabbo(registerPayload.getHabbo()) : null;
        if (!habbo) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.NO_HABBO_WITH_NAME.code)
                .withField('habbo')
                .withMessage(ErrorCodes.NO_HABBO_WITH_NAME.description)
                .build());
            return;
        }

        const memberSince = new Date(habbo.getMemberSince()).getTime() / 1000;
        if (memberSince > (TimeUtility.getCurrentTime() - RegisterPayloadValidator.ONE_WEEK)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_TO_YOUNG.code)
                .withField('habbo')
                .withMessage(ErrorCodes.HABBO_TO_YOUNG.description)
                .build());
        }

        if (!habbo.getMotto() || habbo.getMotto() !== 'wishhabbo-register') {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_MOTTO_INCORRECT.code)
                .withField('habbo')
                .withMessage(ErrorCodes.HABBO_MOTTO_INCORRECT.description)
                .build());
        }
    }

    private validateInvalidPassword (registerPayload: RegisterPayload, errors: Array<ValidationError>): void {
        if (!registerPayload.getPassword() || !registerPayload.getPassword().match(RegexConstants.VALID_PASSWORD)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_PASSWORD.code)
                .withField('password')
                .withMessage(ErrorCodes.INVALID_PASSWORD.description)
                .build());
        }
    }

    private validateConfirmedPassword (registerPayload: RegisterPayload, errors: Array<ValidationError>): void {
        if (!registerPayload.getRepassword() || registerPayload.getPassword() !== registerPayload.getRepassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_CONFIRMED_PASSWORD.code)
                .withField('repassword')
                .withMessage(ErrorCodes.INVALID_CONFIRMED_PASSWORD.description)
                .build());
        }
    }
}
