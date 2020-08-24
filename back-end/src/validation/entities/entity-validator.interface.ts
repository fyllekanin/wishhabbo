import { ValidationError } from '../validation.error';
import { IEntity } from '../../persistance/entities/entity.interface';
import { ServiceConfig } from '../../utilities/internal.request';
import { UserEntity } from '../../persistance/entities/user/user.entity';

export interface EntityValidator<T extends IEntity> {

    isValidEntity (entity: T): boolean;

    validate (entity: T, serviceConfig: ServiceConfig, user: UserEntity): Promise<Array<ValidationError>>;
}
