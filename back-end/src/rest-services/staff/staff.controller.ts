import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';
import { DashboardPage } from '../../rest-service-views/respond-views/staff/dashboard.page';
import { TimetableType } from '../../persistance/entities/staff/timetable.entity';
import { UserGroupOrchestrator } from '../../persistance/repositories/group/user-group.orchestrator';

@Controller('api/staff')
export class StaffController {

    @Get('dashboard')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async getDashboard (req: InternalRequest, res: Response): Promise<void> {

        if (!await UserGroupOrchestrator.doUserHaveAnyStaffPermission(req.serviceConfig, req.user.userId)) {
            res.status(BAD_REQUEST).json();
            return;
        }

        res.status(OK).json(DashboardPage.newBuilder()
            .withRadioSlotcount(await req.serviceConfig.timetableRepository.getSlotCount(TimetableType.RADIO, req.user.userId))
            .withArticleCount(await req.serviceConfig.articleRepository.getArticleCount(req.user.userId))
            .withEventSlotCount(await req.serviceConfig.timetableRepository.getSlotCount(TimetableType.RADIO, req.user.userId))
            .build());
    }
}
