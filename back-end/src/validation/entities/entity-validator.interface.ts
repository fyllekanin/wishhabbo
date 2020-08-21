import { ValidationError } from '../validation.error';
import { IEntity } from '../../persistance/entities/entity.interface';
import { ServiceConfig } from '../../utilities/internal.request';

export interface EntityValidator<T extends IEntity> {

    isValidEntity (entity: T): boolean;

    validate (entity: T, serviceConfig: ServiceConfig): Promise<Array<ValidationError>>;
}
