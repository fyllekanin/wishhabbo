import { NextFunction, Response } from 'express';
import { NOT_FOUND } from 'http-status-codes';
import { InternalRequest } from '../../utilities/internal.request';
import { UserGroupOrchestrator } from '../../persistance/repositories/group/user-group.orchestrator';

export const GET_STAFF_PERMISSION_MIDDLEWARE = (permissions: Array<number>):
    (req: InternalRequest, res: Response, next: NextFunction) => void => {
    return async (req: InternalRequest, res: Response, next: NextFunction) => {

        for (const permission of permissions) {
            if (await UserGroupOrchestrator.doUserHaveStaffPermission(req.serviceConfig, req.user.userId, permission)) {
                next();
                return;
            }
        }
        res.status(NOT_FOUND).json();
    };
};
