import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';
import { TimetableType } from '../../persistance/entities/staff/timetable.entity';
import { DashboardPage } from '../../rest-service-views/respond-views/admin/dashboard.page';
import { UserGroupOrchestrator } from '../../persistance/repositories/group/user-group.orchestrator';

@Controller('api/admin')
export class AdminController {

    @Get('dashboard')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    private async getDashboard (req: InternalRequest, res: Response): Promise<void> {

        if (!await UserGroupOrchestrator.doUserHaveAnyAdminPermission(req.serviceConfig, req.user.userId)) {
            res.status(BAD_REQUEST).json();
            return;
        }

        res.status(OK).json(DashboardPage.newBuilder()
            .withEventSlotCount(await req.serviceConfig.timetableRepository.getAmountOfTotalSlots(TimetableType.EVENTS))
            .withRadioSlotCount(await req.serviceConfig.timetableRepository.getAmountOfTotalSlots(TimetableType.RADIO))
            .withStaffCount(await UserGroupOrchestrator.getAmountOfMembersWithStaffPermissions(req.serviceConfig))
            .withUserCount(await req.serviceConfig.userRepository.getAmountOfMembers())
            .build());
    }
}
