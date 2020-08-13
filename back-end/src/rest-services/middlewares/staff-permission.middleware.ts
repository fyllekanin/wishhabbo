import { NextFunction, Response } from 'express';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';
import { NOT_FOUND } from 'http-status-codes';
import { GroupRepository } from '../../persistance/repositories/group.repository';
import { InternalRequest } from '../../utilities/internal.request';

export const GET_STAFF_PERMISSION_MIDDLEWARE = (permissions: Array<number>): (req: InternalRequest, res: Response, next: NextFunction) => void => {
    return async (req: InternalRequest, res: Response, next: NextFunction) => {
        const tokenRepository = new TokenRepository();
        const groupRepository = new GroupRepository();

        const userId = await tokenRepository.getUserIdFromRequest(req);
        for (const permission of permissions) {
            if (await groupRepository.haveStaffPermission(userId, permission)) {
                next();
                return;
            }
        }
        res.status(NOT_FOUND).json();
    };
};
