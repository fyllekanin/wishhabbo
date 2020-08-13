import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { NOT_FOUND, OK } from 'http-status-codes';
import { GroupRepository } from '../../persistance/repositories/group.repository';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';

@Controller('api/staff')
export class StaffController {

    @Get('dashboard')
    @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async getDashboard (req: InternalRequest, res: Response): Promise<void> {
        const groupRepository = new GroupRepository();

        const groups = await groupRepository.getGroupsUserHave(req.user.userId);

        if (groups.every(group => group.staffPermissions === 0)) {
            res.status(NOT_FOUND).json(null);
            return;
        }

        res.status(OK).json(null);
    }
}
