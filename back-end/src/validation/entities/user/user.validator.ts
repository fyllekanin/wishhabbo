import { EntityValidator } from '../entity-validator.interface';
import { ValidationError } from '../../validation.error';
import { UserEntity } from '../../../persistance/entities/user/user.entity';
import { UserRepository } from '../../../persistance/repositories/user/user.repository';
import { ErrorCodes } from '../../error.codes';
import { IEntity } from '../../../persistance/entities/entity.interface';
import { InternalUser, ServiceConfig } from '../../../utilities/internal.request';
import { RegexConstants } from '../../../constants/regex.constants';

export class UserValidation implements EntityValidator<UserEntity> {

    async validate (entity: IEntity, serviceConfig: ServiceConfig, user: InternalUser): Promise<Array<ValidationError>> {
        const userEntity = entity as UserEntity;
        const errors: Array<ValidationError> = [];

        this.validateInvalidUsername(userEntity, errors);
        await this.validateExistingUsername(userEntity, serviceConfig.userRepository, errors);

        return errors;
    }

    isValidEntity (entity: IEntity): boolean {
        return entity instanceof UserEntity;
    }

    private async validateExistingUsername (entity: UserEntity, userRepository: UserRepository,
                                            errors: Array<ValidationError>): Promise<void> {
        const user = await userRepository.getUserWithUsername(entity.username);
        if (user) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.EXISTING_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.EXISTING_USERNAME.description)
                .build());
        }
    }

    private validateInvalidUsername (entity: UserEntity, errors: Array<ValidationError>): void {
        if (!entity.username) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_USERNAME.code)
                .withField('username')
                .withMessage('Username need to have at least one character or more')
                .build());
        }
        if (!entity.username.match(RegexConstants.VALID_USERNAME)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.INVALID_USERNAME.description)
                .build());
        }
    }
}
