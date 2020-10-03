import { Controller, Get, Middleware } from '@overnightjs/core';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';
import { DashboardPage } from '../../rest-service-views/respond-views/staff/dashboard.page';
import { TimetableType } from '../../persistance/entities/staff/timetable.entity';

@Controller('api/staff')
export class StaffController {

    @Get('dashboard')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    private async getDashboard (req: InternalRequest, res: Response): Promise<void> {


        res.status(OK).json(DashboardPage.newBuilder()
            .withRadioSlotcount(await req.serviceConfig.timetableRepository.getSlotCount(TimetableType.RADIO, req.user.userId))
            .withArticleCount(await req.serviceConfig.articleRepository.getArticleCount(req.user.userId))
            .withEventSlotCount(await req.serviceConfig.timetableRepository.getSlotCount(TimetableType.RADIO, req.user.userId))
            .build());
    }
}
