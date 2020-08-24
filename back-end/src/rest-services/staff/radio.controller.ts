import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest } from '../../utilities/internal.request';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from '../middlewares/staff-permission.middleware';
import { Permissions } from '../../constants/permissions.constant';
import { TimetableController } from './timetable.controller';
import { TimetableEntity, TimetableType } from '../../persistance/entities/staff/timetable.entity';
import { TimetableSlot } from '../../rest-service-views/timetable.slot';
import { ValidationValidators } from '../../validation/validation.validators';
import { Logger } from '../../logging/log.logger';
import { LogTypes } from '../../logging/log.types';

const middlewares = [
    AUTHORIZATION_MIDDLEWARE,
    GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_BOOK_RADIO ])
];

@Controller('api/staff/radio')
export class RadioController extends TimetableController {

    @Get('slots')
    @Middleware(middlewares)
    private async getSlots (req: InternalRequest, res: Response): Promise<void> {
        const slots = await req.serviceConfig.timetableRepository.getSlots(TimetableType.RADIO);
        res.status(OK).json(await this.getConvertedSlots(req, slots));
    }

    @Put(':timetableId')
    @Middleware(middlewares)
    private async updateBooking (req: InternalRequest, res: Response): Promise<void> {
        const entity = await req.serviceConfig.timetableRepository.get(Number(req.params.timetableId));
        if (!entity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const slot = TimetableSlot.of(req, true, entity.timetableId);
        const errors = await ValidationValidators.validatePayload(slot, req.serviceConfig, req);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const copy = { ...entity };
        const user = slot.getUser() && slot.getUser().getUsername() ?
            await req.serviceConfig.userRepository.getUserWithUsername(slot.getUser().getUsername()) : null;
        entity.hour = slot.getHour();
        entity.day = slot.getDay();
        entity.userId = user ? user.userId : entity.userId;
        const updatedEntity = await req.serviceConfig.timetableRepository.save(entity);

        await Logger.createStaffLog(req, {
            id: LogTypes.UPDATED_TIMETABLE_SLOT,
            contentId: entity.timetableId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(copy),
            afterChange: JSON.stringify(updatedEntity)
        });
        res.status(OK).json();
    }

    @Post('book')
    @Middleware(middlewares)
    private async createBooking (req: InternalRequest, res: Response): Promise<void> {
        const slot = TimetableSlot.of(req, true, null);
        const errors = await ValidationValidators.validatePayload(slot, req.serviceConfig, req);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const user = slot.getUser() && slot.getUser().getUsername() ?
            await req.serviceConfig.userRepository.getUserWithUsername(slot.getUser().getUsername()) : null;
        const entity = TimetableEntity.newBuilder()
            .withDay(slot.getDay())
            .withHour(slot.getHour())
            .withType(TimetableType.RADIO)
            .withUserId(user ? user.userId : req.user.userId)
            .build();
        const updatedEntity = await req.serviceConfig.timetableRepository.save(entity);

        await Logger.createStaffLog(req, {
            id: LogTypes.CREATED_TIMETABLE_SLOT,
            contentId: entity.timetableId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(updatedEntity)
        });
        res.status(OK).json();
    }

    @Delete('unbook/:timetableId')
    @Middleware(middlewares)
    private async deleteBooking (req: InternalRequest, res: Response): Promise<void> {
        const entity = await req.serviceConfig.timetableRepository.get(Number(req.params.timetableId));
        if (!entity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const canUnbookThisSlot = entity.userId === req.user.userId ||
            await req.serviceConfig.groupRepository
                .haveStaffPermission(req.user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO);

        if (!canUnbookThisSlot) {
            res.status(NOT_FOUND).json();
            return;
        }

        await req.serviceConfig.timetableRepository.delete(entity);
        await Logger.createStaffLog(req, {
            id: LogTypes.DELETED_TIMETABLE_SLOT,
            contentId: entity.timetableId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(entity),
            afterChange: null
        });
        res.status(OK).json(null);
    }
}
