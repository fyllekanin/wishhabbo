import { ValidationError } from '../validation.error';
import { EntityValidator } from '../entities/entity-validator.interface';
import { IPayload } from '../../rest-service-views/payloads/payload.interface';
import { RegisterPayload } from '../../rest-service-views/payloads/auth/register.payload';
import { ErrorCodes } from '../error.codes';
import { HabboService } from '../../external/services/habbo.service';

export class RegisterPayloadValidator implements EntityValidator<RegisterPayload> {

    async validate (payload: IPayload): Promise<Array<ValidationError>> {
        const registerPayload = payload as RegisterPayload;
        const habboService = new HabboService();
        const errors: Array<ValidationError> = [];

        this.validateInvalidPassword(registerPayload, errors);
        this.validateConfirmedPassword(registerPayload, errors);
        await this.validateHabboMotto(registerPayload, errors, habboService);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof RegisterPayload;
    }

    private async validateHabboMotto (registerPayload: RegisterPayload, errors: Array<ValidationError>,
                                      habboService: HabboService): Promise<void> {
        const habbo = await habboService.getHabbo(registerPayload.getHabbo());
        if (!habbo) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.NO_HABBO_WITH_NAME.code)
                .withField('habbo')
                .withMessage(ErrorCodes.NO_HABBO_WITH_NAME.description)
                .build());
            return;
        }

        if (!habbo.getMotto() || habbo.getMotto() !== 'apa') {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.HABBO_MOTTO_INCORRECT.code)
                .withField('habbo')
                .withMessage(ErrorCodes.HABBO_MOTTO_INCORRECT.description)
                .build());
        }
    }

    private validateInvalidPassword (registerPayload: RegisterPayload, errors: Array<ValidationError>): void {
        if (!registerPayload.getPassword() || registerPayload.getPassword().length < 8) {
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
