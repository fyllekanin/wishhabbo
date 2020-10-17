import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { SettingKey } from '../../../persistance/entities/settings/setting.entity';
import { HomePagemodel } from '../../../persistance/entities/settings/models/home-page.model';
import ExpressFormidable from 'express-formidable';

@Controller('api/admin/website-settings/home-page-settings')
export class HomePageSettingsController {

    @Get()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([Permissions.ADMIN.CAN_MANAGE_HOME_PAGE])
    ])
    private async getHomePageSettings (req: InternalRequest, res: Response): Promise<void> {
        const homePagemodel = await req.serviceConfig.settingRepository.getKeyValue<HomePagemodel>(SettingKey.HOME_PAGE);
        res.status(OK).json(homePagemodel);
    }

    @Post()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([Permissions.ADMIN.CAN_MANAGE_HOME_PAGE]),
        ExpressFormidable({
            multiples: true
        })
    ])
    private async updateHomePageSettings (req: InternalRequest, res: Response): Promise<void> {
        // Empty..
    }
}
