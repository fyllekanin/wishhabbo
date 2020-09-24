import { Logger } from './../logging/log.logger';
import { ValidationValidators } from './../validation/validation.validators';
import { RadioRequestEntity } from './../persistance/entities/staff/radio-request.entity';
import { Controller, Get, Post } from '@overnightjs/core';
import { Response } from 'express';
import { OK, BAD_REQUEST } from 'http-status-codes';
import { InternalRequest } from '../utilities/internal.request';
import { ContinuesInformationView } from '../rest-service-views/respond-views/continues-information.view';
import { SettingKey } from '../persistance/entities/settings/setting.entity';
import { LogTypes } from '..//logging/log.types';

@Controller('api/information')
export class InformationController {

    @Get('continues')
    private async getContinuesInformation (req: InternalRequest, res: Response): Promise<void> {
        res.status(OK).json(ContinuesInformationView.newBuilder()
            .withRadioStats(await req.serviceConfig.settingRepository.getKeyValue(SettingKey.RADIO_STATS))
            .build());
    }

    @Get('bbcodes')
    private async getBbcodes (req: InternalRequest, res: Response): Promise<void> {
        res.status(OK).json(await req.serviceConfig.bbcodeRepository.getAll());
    }

    @Post('radio-request')
    private async createRadioRequest(req: InternalRequest, res: Response): Promise<void> {
        const entity = RadioRequestEntity.of(req);
        const errors = await ValidationValidators.validateEntity(entity, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const saved = await req.serviceConfig.radioRequestRepository.save(entity);
        await Logger.createUserLog(req, {
            id: LogTypes.RADIO_REQUEST,
            contentId: saved.radioRequestId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(saved.radioRequestId)
        });
        res.status(OK).json();
    }
}
