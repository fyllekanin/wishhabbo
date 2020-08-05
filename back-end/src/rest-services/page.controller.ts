import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { TokenRepository } from '../persistance/repositories/user/token.repository';

@Controller('api/page')
export class PageController {

    @Get('test')
    // @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async getTest (req: Request, res: Response): Promise<void> {
        res.status(OK).json(await new TokenRepository().getTokens());
    }
}
