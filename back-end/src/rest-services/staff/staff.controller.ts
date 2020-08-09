import { Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { NOT_FOUND, OK } from 'http-status-codes';
import { TokenRepository } from '../../persistance/repositories/user/token.repository';
import { GroupRepository } from '../../persistance/repositories/group.repository';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';

@Controller('api/staff')
export class StaffController {

    @Get('dashboard')
    @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async getDashboard (req: Request, res: Response): Promise<void> {
        const tokenRepository = new TokenRepository();
        const groupRepository = new GroupRepository();
        const token = await tokenRepository.getTokenFromRequest(req);

        const groups = await groupRepository.getGroupsUserHave(token.userId);

        if (groups.every(group => group.staffPermissions === 0)) {
            res.status(NOT_FOUND).json(null);
            return;
        }

        res.status(OK).json(null);
    }
}
