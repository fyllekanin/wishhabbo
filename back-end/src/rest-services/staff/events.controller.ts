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
    GET_STAFF_PERMISSION_MIDDLEWARE([ Permissions.STAFF.CAN_BOOK_EVENTS ])
];

@Controller('api/staff/events')
export class StaffController extends TimetableController {

    @Get('list')
    private async getEventsList (req: InternalRequest, res: Response): Promise<void> {
        res.status(OK).json(await req.serviceConfig.eventsRepository.all());
    }

    @Get('slots')
    private async getSlots (req: InternalRequest, res: Response): Promise<void> {
        const slots = await req.serviceConfig.timetableRepository.getSlots(TimetableType.EVENTS);
        const items = [];
        const currentDay = new Date().getUTCDay();
        const currentHour = new Date().getUTCHours();

        for (let d = 1; d < 8; d++) {
            for (let h = 0; h < 24; h++) {
                const slot = slots.find(item => item.day === d && item.hour === h);
                const user = slot ? await req.serviceConfig.userRepository.getSlimUserById(slot.userId) : null;
                const event = slot ? await req.serviceConfig.eventsRepository.get(slot.eventId) : null;
                items.push(TimetableSlot.newBuilder()
                    .withTimetableId(slot ? slot.timetableId : null)
                    .withDay(d)
                    .withHour(h)
                    .withEvent(event)
                    .withIsBooked(Boolean(slot))
                    .withIsCurrentSlot(d === currentDay && h === currentHour)
                    .withUser(user)
                    .build());
            }
        }


        res.status(OK).json(items);
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
        entity.eventId = slot.getEvent().eventId;
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
            .withEventId(slot.getEvent().eventId)
            .withType(TimetableType.EVENTS)
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
                .haveStaffPermission(req.user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_EVENTS);

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
