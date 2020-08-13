import { Request } from 'express';
import { UserEntity } from '../persistance/entities/user/user.entity';

export interface InternalRequest extends Request {
    user: UserEntity;
}
