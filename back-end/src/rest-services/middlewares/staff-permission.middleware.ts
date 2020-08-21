import { NextFunction, Response } from 'express';
import { NOT_FOUND } from 'http-status-codes';
import { InternalRequest } from '../../utilities/internal.request';

export const GET_STAFF_PERMISSION_MIDDLEWARE = (permissions: Array<number>):
    (req: InternalRequest, res: Response, next: NextFunction) => void => {
    return async (req: InternalRequest, res: Response, next: NextFunction) => {

        const userId = await req.serviceConfig.tokenRepository.getUserIdFromRequest(req);
        for (const permission of permissions) {
            if (await req.serviceConfig.groupRepository.haveStaffPermission(userId, permission)) {
                next();
                return;
            }
        }
        res.status(NOT_FOUND).json();
    };
};
