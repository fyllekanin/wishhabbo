import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { InternalRequest } from '../utilities/internal.request';
import { ContinuesInformationView } from '../rest-service-views/respond-views/continues-information.view';
import { SettingKey } from '../persistance/entities/settings/setting.entity';

@Controller('api/information')
export class InformationController {

    @Get('continues')
    private async getContinuesInformation (req: InternalRequest, res: Response): Promise<void> {
        res.status(OK).json(ContinuesInformationView.newBuilder()
            .withRadioStats(await req.serviceConfig.settingRepository.getKeyValue(SettingKey.RADIO_STATS))
            .build());
    }
}
