import { TimetableUtility } from './../../utilities/timetable.utility';
import { Logger } from './../../logging/log.logger';
import { RadioRequestView } from './../../rest-service-views/respond-views/staff/media/radio-request.view';
import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { InternalRequest, ServiceConfig } from '../../utilities/internal.request';
import { GET_STAFF_PERMISSION_MIDDLEWARE } from '../middlewares/staff-permission.middleware';
import { Permissions } from '../../constants/permissions.constant';
import { TimetableController } from './timetable.controller';
import { TimetableEntity, TimetableType } from '../../persistance/entities/staff/timetable.entity';
import { TimetableSlot } from '../../rest-service-views/two-way/staff/timetable.slot';
import { ValidationValidators } from '../../validation/validation.validators';
import { LogTypes } from '../../logging/log.types';
import { LogRepository } from '../../persistance/repositories/log.repository';
import { TimeUtility } from '../../utilities/time.utility';
import { ErrorsCreator } from '../../validation/errors.creator';
import { RadioStatsModel } from '../../persistance/entities/settings/models/radio-stats.model';
import { SettingKey } from '../../persistance/entities/settings/setting.entity';
import { SlimUserView } from '../../rest-service-views/two-way/slim-user.view';
import { PaginationWhereOperators } from '../../persistance/repositories/base.repository';
import { UserGroupOrchestrator } from '../../persistance/repositories/group/user-group.orchestrator';
import { ConnectionInformationPage } from '../../rest-service-views/respond-views/staff/radio/connection-information.page';
import { RadioSettingsModel } from '../../persistance/entities/settings/models/radio-settings.model';

const middlewares = [
    AUTHORIZATION_MIDDLEWARE,
    GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_BOOK_RADIO])
];

@Controller('api/staff/radio')
export class RadioController extends TimetableController {
    private static readonly THIRTY_MINUTES = 1800;

    @Get('connection-information')
    @Middleware([AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_BOOK_RADIO])])
    async getConnectionInformation (req: InternalRequest, res: Response): Promise<void> {
        const canSeeInformation = await UserGroupOrchestrator
                .doUserHaveStaffPermission(req.serviceConfig, req.user.userId, Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO) ||
            await this.isUserCurrentOrNextDj(req.serviceConfig, req.user.userId);

        if (!canSeeInformation) {
            res.status(OK).json(ConnectionInformationPage.newBuilder()
                .withCanSeeInformation(false)
                .build());
            return;
        }

        const radioSettings = await req.serviceConfig.settingRepository.getKeyValue<RadioSettingsModel>(SettingKey.RADIO_SETTINGS)
            .then(result => result || {
                serverType: null,
                host: null,
                port: null,
                password: null,
                mountPoint: null
            });
        res.status(OK).json(ConnectionInformationPage.newBuilder()
            .withCanSeeInformation(true)
            .withServerType(radioSettings.serverType)
            .withHost(radioSettings.host)
            .withPort(radioSettings.port)
            .withPassword(radioSettings.password)
            .withMountPoint(radioSettings.mountPoint)
            .build());
    }

    @Get('requests')
    @Middleware([AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_BOOK_RADIO])])
    async getRadioRequests (req: InternalRequest, res: Response): Promise<void> {
        const requests = await req.serviceConfig.radioRequestRepository.getRequestsWithinTwoHours();
        const items = [];

        for (const request of requests) {
            items.push(RadioRequestView.newBuilder()
                .withRadioRequestId(request.radioRequestId)
                .withUser(await req.serviceConfig.userRepository.getSlimUserById(request.userId))
                .withRequest(request.request)
                .withCreatedAt(request.createdAt)
                .build());
        }

        res.status(OK).json(items);
    }

    @Delete('requests/:radioRequestId')
    @Middleware([AUTHORIZATION_MIDDLEWARE, GET_STAFF_PERMISSION_MIDDLEWARE([Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO])])
    async deleteRadioRequests (req: InternalRequest, res: Response): Promise<void> {
        const request = await req.serviceConfig.radioRequestRepository.get(Number(req.params.radioRequestId));
        if (!request) {
            res.status(NOT_FOUND).json();
            return;
        }

        await req.serviceConfig.radioRequestRepository.delete(request);
        await Logger.createStaffLog(req, {
            id: LogTypes.DELETE_RADIO_REQUEST,
            contentId: request.radioRequestId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(request),
            afterChange: null
        });
        res.status(OK).json();
    }

    @Post('like')
    @Middleware([AUTHORIZATION_MIDDLEWARE])
    async createRadioLike (req: InternalRequest, res: Response): Promise<void> {
        const radioStats = await req.serviceConfig.settingRepository.getKeyValue<RadioStatsModel>(SettingKey.RADIO_STATS);
        if (!radioStats || !radioStats.currentDj) {
            res.status(BAD_REQUEST).json([{
                name: 'Can\'t find the current DJ',
                message: 'The current DJ was not possible to find'
            }]);
            return;
        }

        const slimDj = SlimUserView.of(radioStats.currentDj);
        const djEntity = await req.serviceConfig.userRepository.getUserById(slimDj.getUserId());
        const thirtyMinutesAgo = TimeUtility.getCurrentTime() - RadioController.THIRTY_MINUTES;
        const items = await LogRepository.getRepositoryForUser().paginate({
            page: 1,
            take: 1,
            where: [
                { key: 'userId', operator: PaginationWhereOperators.EQUALS, value: req.user.userId },
                { key: 'id', operator: PaginationWhereOperators.EQUALS, value: LogTypes.LIKED_RADIO },
                { key: 'createdAt', operator: PaginationWhereOperators.EQUALS, value: thirtyMinutesAgo }
            ]
        });

        if (items.getItems().length > 0) {
            const secondsUntilCanLike = (items.getItems()[0].createdAt + RadioController.THIRTY_MINUTES)
                - TimeUtility.getCurrentTime();
            res.status(BAD_REQUEST).json([
                ErrorsCreator.createLikingRadioToFastValidationError(`${Math.round(secondsUntilCanLike / 60)}`)
            ]);
            return;
        }

        const updated = djEntity.newBuilderFromCurrent()
            .withLikes(djEntity.likes + 1)
            .build();
        await req.serviceConfig.userRepository.save(updated);
        await Logger.createUserLog(req, {
            id: LogTypes.LIKED_RADIO,
            contentId: updated.userId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(djEntity),
            afterChange: JSON.stringify(updated)
        });
        res.status(OK).json();
    }

    @Get('slots')
    async getSlots (req: InternalRequest, res: Response): Promise<void> {
        const slots = await req.serviceConfig.timetableRepository.getSlots(TimetableType.RADIO);
        res.status(OK).json(await TimetableUtility.getConvertedSlots(req, slots));
    }

    @Put(':timetableId')
    @Middleware(middlewares)
    async updateBooking (req: InternalRequest, res: Response): Promise<void> {
        const entity = await req.serviceConfig.timetableRepository.get(Number(req.params.timetableId));
        if (!entity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const result = await this.doUpdateSlot(req, entity, true);
        if (result.errors.length > 0) {
            res.status(BAD_REQUEST).json(result.errors);
            return;
        }

        await Logger.createStaffLog(req, {
            id: LogTypes.UPDATED_TIMETABLE_SLOT,
            contentId: entity.timetableId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(result.original),
            afterChange: JSON.stringify(result.updated)
        });
        res.status(OK).json();
    }

    @Post('book')
    @Middleware(middlewares)
    async createBooking (req: InternalRequest, res: Response): Promise<void> {
        const slot = TimetableSlot.of(req, true, null);
        const errors = await ValidationValidators.validatePayload(slot, req.serviceConfig, req.user);
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
    async deleteBooking (req: InternalRequest, res: Response): Promise<void> {
        const entity = await req.serviceConfig.timetableRepository.get(Number(req.params.timetableId));
        if (!entity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const canUnbookThisSlot = entity.userId === req.user.userId ||
            await UserGroupOrchestrator.doUserHaveStaffPermission(req.serviceConfig,
                req.user.userId,
                Permissions.STAFF.CAN_UNBOOK_OTHERS_RADIO);

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

    private async isUserCurrentOrNextDj (serviceConfig: ServiceConfig, userId: number): Promise<boolean> {
        const day = TimeUtility.getCurrentDay();
        const hour = TimeUtility.getCurrentHour();
        const currentSlot = await serviceConfig.timetableRepository.getSlotForTime(day, hour, TimetableType.RADIO);

        const nextHour = hour + 1 >= 24 ? 0 : hour + 1;
        const nextDay = nextHour === 0 ? (day + 1 > 7 ? 1 : day + 1) : day;
        const nextSlot = await serviceConfig.timetableRepository.getSlotForTime(nextDay, nextHour, TimetableType.RADIO);

        return currentSlot.userId === userId || nextSlot.userId === userId;
    }
}
