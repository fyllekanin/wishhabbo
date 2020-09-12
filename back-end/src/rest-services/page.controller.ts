import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { InternalRequest } from '../utilities/internal.request';

@Controller('api/page')
export class PageController {

    @Get('test')
    private async getTest (req: InternalRequest, res: Response): Promise<void> {
        res.status(OK).json(req.serviceConfig.tokenRepository.getTokens());
    }
}
