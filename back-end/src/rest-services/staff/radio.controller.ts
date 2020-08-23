import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from '../middlewares/staff-permission.middleware';
import { Permissions } from '../../constants/permissions.constant';
import { TimetableController } from './timetable.controller';

const middlewares = [
    AUTHORIZATION_MIDDLEWARE,
    GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_BOOK_RADIO ])
];

@Controller('api/staff/radio')
export class StaffController extends TimetableController {

    @Get('slots')
    @Middleware(middlewares)
    private async getSlots (req: InternalRequest, res: Response): Promise<void> {

        res.status(OK).json(null);
    }

    @Put(':timetableId')
    @Middleware(middlewares)
    private async updateBooking (req: InternalRequest, res: Response): Promise<void> {

        res.status(OK).json(null);
    }

    @Post('book')
    @Middleware(middlewares)
    private async createBooking (req: InternalRequest, res: Response): Promise<void> {

        res.status(OK).json(null);
    }

    @Delete('unbook/:timetableId')
    @Middleware(middlewares)
    private async deleteBooking (req: InternalRequest, res: Response): Promise<void> {

        res.status(OK).json(null);
    }
}
