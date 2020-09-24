import { TimeUtility } from './../../utilities/time.utility';
import { LogTypes } from './../../logging/log.types';
import { LogRepository } from './../../persistance/repositories/log.repository';
import { RadioRequestEntity } from './../../persistance/entities/staff/radio-request.entity';
import { EntityValidator } from './entity-validator.interface';
import { ValidationError } from '../validation.error';
import { IEntity } from '../../persistance/entities/entity.interface';
import { InternalUser, ServiceConfig } from '../../utilities/internal.request';
import { ErrorCodes } from '../error.codes';

export class RadioRequestValidator implements EntityValidator<RadioRequestEntity> {
    private static readonly TWO_MINUTES = 120;

    async validate (entity: IEntity, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const radioRequestEntity = entity as RadioRequestEntity;
        const errors: Array<ValidationError> = [];

        await this.validateRequestMessage(radioRequestEntity, errors);
        await this.validateUserSpam(errors, user);

        return errors;
    }

    isValidEntity (entity: IEntity): boolean {
        return entity instanceof RadioRequestEntity;
    }

    private async validateRequestMessage (entity: RadioRequestEntity, errors: Array<ValidationError>): Promise<void> {
        if (!entity.request || entity.request.length < 5) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EMPTY_FIELD.code)
                .withField('request')
                .withMessage(ErrorCodes.EMPTY_FIELD.description)
                .build());
        }
    }

    private async validateUserSpam (errors: Array<ValidationError>, user: InternalUser): Promise<void> {
        const items = await LogRepository.getRepositoryForUser().paginate({
            take: 1,
            page: 1,
            where: [
                { key: 'id', operator: '=', value: LogTypes.RADIO_REQUEST },
                { key: 'userId', operator: '=', value: user.userId },
                { key: 'createdAt', operator: '>', value: TimeUtility.getCurrent() + RadioRequestValidator.TWO_MINUTES}
            ]
        });

        if (items.getItems().length > 0) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.SPAM_ERROR.code)
                .withField('')
                .withMessage(ErrorCodes.SPAM_ERROR.description)
                .build());
        }
    }
}
