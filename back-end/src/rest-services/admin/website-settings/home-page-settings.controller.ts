import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { SettingKey } from '../../../persistance/entities/settings/setting.entity';
import { HomePagemodel } from '../../../persistance/entities/settings/models/home-page.model';
import ExpressFormidable from 'express-formidable';
import {
    HomePageBannerEntry,
    HomePageStarLight,
    HomePageView
} from '../../../rest-service-views/two-way/home-page.view';
import { ValidationValidators } from '../../../validation/validation.validators';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';

@Controller('api/admin/website-settings/home-page-settings')
export class HomePageSettingsController {

    @Get()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([Permissions.ADMIN.CAN_MANAGE_HOME_PAGE])
    ])
    private async getHomePageSettings (req: InternalRequest, res: Response): Promise<void> {
        const homePageModel = await req.serviceConfig.settingRepository.getKeyValue<HomePagemodel>(SettingKey.HOME_PAGE);

        if (!homePageModel) {
            res.status(OK).json(null);
            return;
        }

        const homePageView = HomePageView.newBuilder()
            .withStarLight(HomePageStarLight.newBuilder()
                .withText(homePageModel.starLight ? homePageModel.starLight.text : null)
                .withUser(homePageModel.starLight ?
                    await req.serviceConfig.userRepository.getSlimUserById(homePageModel.starLight.userId) : null)
                .build())
            .withBannerEntries((homePageModel.bannerEntries || []).map(entry => HomePageBannerEntry.newBuilder()
                .withId(entry.id)
                .withCaption(entry.caption)
                .build()))
            .build();

        res.status(OK).json(homePageView);
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
        const payload = HomePageView.of(JSON.parse(req.fields.settings as string), req.files);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);

        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const deletedBannerEntries = payload.getBannerEntries().filter(entry => entry.getIsDeleted());
        const updatedOrNewBannerEntries = payload.getBannerEntries().filter(entry => entry.getIsUpdated() || entry.getIsNew());

        for (const entry of deletedBannerEntries) {
            await req.serviceConfig.resourceRepository.removeBannerEntry(entry.getId());
        }

        for (const entry of updatedOrNewBannerEntries) {
            await req.serviceConfig.resourceRepository.uploadBannerEntry(entry.getFile(), entry.getId());
        }

        const setting = await req.serviceConfig.settingRepository.getSetting(SettingKey.HOME_PAGE);
        const oldValue = setting.value;
        setting.value = JSON.stringify(payload);
        await req.serviceConfig.settingRepository.save(setting);
        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_HOME_PAGE_SETTINGS,
            contentId: 0,
            userId: req.user.userId,
            beforeChange: oldValue,
            afterChange: setting.value
        });
        res.status(OK).json();
    }
}
