import { ValidationError } from '../validation.error';
import { IEntity } from '../../persistance/entities/entity.interface';

export interface EntityValidator<T extends IEntity> {

    isValidEntity (entity: T): boolean;

    validate (entity: T): Promise<Array<ValidationError>>;
}
