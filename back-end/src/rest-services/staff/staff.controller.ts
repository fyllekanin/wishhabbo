import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { NOT_FOUND, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';
import { UserGroupOrchestrator } from '../../persistance/repositories/group/user-group.orchestrator';

@Controller('api/staff')
export class StaffController {

    @Get('dashboard')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    private async getDashboard (req: InternalRequest, res: Response): Promise<void> {
        const groups = await UserGroupOrchestrator.getGroupsByUser(req.serviceConfig, req.user.userId);

        if (groups.every(group => group.staffPermissions === 0)) {
            res.status(NOT_FOUND).json(null);
            return;
        }

        res.status(OK).json(null);
    }
}
