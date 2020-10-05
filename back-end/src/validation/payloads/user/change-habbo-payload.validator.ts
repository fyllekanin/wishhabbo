import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { ErrorCodes } from '../../error.codes';
import { HabboService } from '../../../external/services/habbo.service';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { TimeUtility } from '../../../utilities/time.utility';
import { ChangeHabboPayload } from '../../../rest-service-views/payloads/user/change-habbo.payload';

export class ChangeHabboPayloadValidator implements PayloadValidator<ChangeHabboPayload> {
    private static readonly ONE_WEEK = 604800;

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const changeHabboPayload = payload as ChangeHabboPayload;
        const errors: Array<ValidationError> = [];

        await this.validateHabboMotto(changeHabboPayload, errors, serviceConfig, user);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof ChangeHabboPayload;
    }

    private async validateHabboMotto (changeHabboPayload: ChangeHabboPayload, errors: Array<ValidationError>,
                                      serviceConfig: ServiceConfig, user: InternalUser): Promise<void> {
        if (await serviceConfig.userRepository.getUserWithHabbo(changeHabboPayload.getHabbo())) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.USER_WITH_HABBO_EXISTS.code)
                .withField('habbo')
                .withMessage(ErrorCodes.USER_WITH_HABBO_EXISTS.description)
                .build());
            return;
        }

        const habboService = new HabboService();
        const habbo = changeHabboPayload.getHabbo() ? await habboService.getHabbo(changeHabboPayload.getHabbo()) : null;
        if (!habbo) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.NO_HABBO_WITH_NAME.code)
                .withField('habbo')
                .withMessage(ErrorCodes.NO_HABBO_WITH_NAME.description)
                .build());
            return;
        }

        const memberSince = new Date(habbo.getMemberSince()).getTime() / 1000;
        if (memberSince > (TimeUtility.getCurrentTime() - ChangeHabboPayloadValidator.ONE_WEEK)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_TO_YOUNG.code)
                .withField('habbo')
                .withMessage(ErrorCodes.HABBO_TO_YOUNG.description)
                .build());
        }

        if (!habbo.getMotto() || habbo.getMotto() !== `wishhabbo-${user.userId}`) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_MOTTO_INCORRECT.code)
                .withField('habbo')
                .withMessage(ErrorCodes.HABBO_MOTTO_INCORRECT.description)
                .build());
        }
    }
}
