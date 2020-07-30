import { Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from './middlewares/authorization.middleware';
import { OK } from 'http-status-codes';

@Controller('api/page')
export class PageController {

    @Get('test')
    @Middleware([ AUTHORIZATION_MIDDLEWARE ])
    private async getTest (req: Request, res: Response): Promise<void> {
        res.status(OK).json({ response: 'Cool data you can only see logged in!' });
    }
}
