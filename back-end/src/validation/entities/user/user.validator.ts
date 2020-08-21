import { EntityValidator } from '../entity-validator.interface';
import { ValidationError } from '../../validation.error';
import { UserEntity } from '../../../persistance/entities/user/user.entity';
import { UserRepository } from '../../../persistance/repositories/user/user.repository';
import { ErrorCodes } from '../../error.codes';
import { IEntity } from '../../../persistance/entities/entity.interface';
import { ServiceConfig } from '../../../utilities/internal.request';

export class UserValidation implements EntityValidator<UserEntity> {
    private static readonly VALID_USERNAME = /^[a-zA-Z0-9]+$/;

    async validate (entity: IEntity, serviceConfig: ServiceConfig): Promise<Array<ValidationError>> {
        const user = entity as UserEntity;
        const errors: Array<ValidationError> = [];

        this.validateInvalidUsername(user, errors);
        await this.validateExistingUsername(user, serviceConfig.userRepository, errors);

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
        if (!entity.username.match(UserValidation.VALID_USERNAME)) {
            errors.push(ValidationError.newBuilder()
                .withCode(ErrorCodes.INVALID_USERNAME.code)
                .withField('username')
                .withMessage(ErrorCodes.INVALID_USERNAME.description)
                .build());
        }
    }
}
