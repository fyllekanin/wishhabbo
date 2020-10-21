import { Controller, Get, Middleware, Put } from '@overnightjs/core';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { SettingKey } from '../../../persistance/entities/settings/setting.entity';
import { ValidationValidators } from '../../../validation/validation.validators';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';
import { RadioSettingsView } from '../../../rest-service-views/two-way/admin/radio-settings.view';
import { RadioSettingsModel } from '../../../persistance/entities/settings/models/radio-settings.model';

@Controller('api/admin/website-settings/radio-settings')
export class RadioSettingsController {

    @Get()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([Permissions.ADMIN.CAN_MANAGE_RADIO_SETTINGS])
    ])
    async getRadioSettings (req: InternalRequest, res: Response): Promise<void> {
        const radioSettingsModel = await req.serviceConfig.settingRepository.getKeyValue<RadioSettingsModel>(SettingKey.RADIO_SETTINGS);
        res.status(OK).json(radioSettingsModel);
    }

    @Put()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([Permissions.ADMIN.CAN_MANAGE_RADIO_SETTINGS])
    ])
    async updateRadioSettings (req: InternalRequest, res: Response): Promise<void> {
        const payload = RadioSettingsView.of(req);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        const setting = await req.serviceConfig.settingRepository.getSetting<RadioSettingsView>(SettingKey.RADIO_SETTINGS);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const updated = setting.newBuilderFromCurrent()
            .withValue(payload)
            .build();

        await req.serviceConfig.settingRepository.save(updated);

        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_RADIO_SETTINGS,
            contentId: updated.settingId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(setting),
            afterChange: JSON.stringify(updated)
        });
        res.status(OK).json();
    }
}
