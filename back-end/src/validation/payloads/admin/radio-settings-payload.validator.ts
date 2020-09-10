import { ValidationError } from '../../validation.error';
import { IPayload } from '../../../rest-service-views/payloads/payload.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { PayloadValidator } from '../payload-validator.interface';
import { RadioSettingsView, ServerType } from '../../../rest-service-views/two-way/admin/radio-settings.view';
import { ErrorCodes } from '../../error.codes';

export class RadioSettingsPayloadValidator implements PayloadValidator<RadioSettingsView> {

    async validate (payload: IPayload, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const radioSettings = payload as RadioSettingsView;
        const errors: Array<ValidationError> = [];

        this.validateEmptyFields(radioSettings, errors);
        this.validateValidPort(radioSettings, errors);
        this.validateValidServerType(radioSettings, errors);

        return errors;
    }

    isValidEntity (payload: IPayload): boolean {
        return payload instanceof RadioSettingsView;
    }

    private validateValidPort (payload: RadioSettingsView, errors: Array<ValidationError>): void {
        if (!payload.getPort() || !Number.isInteger(payload.getPort())) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_RADIO_PORT.code)
                .withField('port')
                .withMessage(ErrorCodes.INVALID_RADIO_PORT.description)
                .build());
        }
    }

    private validateValidServerType (payload: RadioSettingsView, errors: Array<ValidationError>): void {
        if (!payload.getServerType() || !ServerType[payload.getServerType()]) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_SERVER_TYPE.code)
                .withField('serverType')
                .withMessage(ErrorCodes.INVALID_SERVER_TYPE.description)
                .build());
        }
    }

    private validateEmptyFields (payload: RadioSettingsView, errors: Array<ValidationError>): void {
        if (!payload.getHost() || !payload.getPassword() || !payload.getAdminPassword()) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.MISSING_RADIO_FIELDS.code)
                .withField('fields')
                .withMessage(ErrorCodes.MISSING_RADIO_FIELDS.description)
                .build());
        }
    }
}
