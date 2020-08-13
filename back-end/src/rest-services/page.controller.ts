import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { TokenRepository } from '../persistance/repositories/user/token.repository';
import { InternalRequest } from '../utilities/internal.request';

@Controller('api/page')
export class PageController {

    @Get('test')
    // @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async getTest (req: InternalRequest, res: Response): Promise<void> {
        res.status(OK).json(await new TokenRepository().getTokens());
    }
}
