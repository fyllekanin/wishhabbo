import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { PaginationView } from '../../../rest-service-views/respond-views/pagination.view';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { GroupView } from '../../../rest-service-views/two-way/admin/group.view';
import { PermissionHelper } from '../../../helpers/permission.helper';
import { ValidationValidators } from '../../../validation/validation.validators';
import { GroupEntity } from '../../../persistance/entities/group/group.entity';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';

@Controller('api/admin/users/groups')
export class GroupController {
    private static readonly GROUP_PER_PAGE = 15;

    @Get('page/:page')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_MANAGE_GROUPS ])
    ])
    private async getGroups (req: InternalRequest, res: Response): Promise<void> {
        const page = Number(req.params.page);
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const groups = await req.serviceConfig.groupRepository.getGroups();
        const filteredOnImmunity = groups.filter(group => group.immunity < immunity).sort((a, b) => a.name > b.name ? 1 : -1);

        const start = PaginationHelper.getSkip(page, GroupController.GROUP_PER_PAGE);
        const end = start + GroupController.GROUP_PER_PAGE;
        const items = filteredOnImmunity.slice(start, end).map(item => GroupView.newBuilder()
            .withGroupId(item.groupId)
            .withName(item.name)
            .withImmunity(item.immunity)
            .withDisplayName(item.displayName)
            .withCreatedAt(item.createdAt)
            .withUpdatedAt(item.updatedAt));

        res.status(OK).json(PaginationView.newBuilder()
            .withItems(items)
            .withPage(page)
            .withTotal(PaginationHelper.getTotalAmountOfPages(GroupController.GROUP_PER_PAGE, filteredOnImmunity.length))
            .build());
    }

    @Get(':groupId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_MANAGE_GROUPS ])
    ])
    private async getGroup (req: InternalRequest, res: Response): Promise<void> {
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const group = await req.serviceConfig.groupRepository.getGroupById(Number(req.params.groupId));
        if (!group || group.immunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        res.status(OK).json(GroupView.newBuilder()
            .withGroupId(group.groupId)
            .withName(group.name)
            .withImmunity(group.immunity)
            .withDisplayName(group.displayName)
            .withBarStyle(group.barStyle)
            .withNameColor(group.nameColor)
            .withStaffPermissions(PermissionHelper.getConvertedStaffPermissionsToUI(group))
            .withAdminPermissions(PermissionHelper.getConvertedAdminPermissionsToUI(group))
            .withCreatedAt(group.createdAt)
            .withUpdatedAt(group.updatedAt)
            .build());
    }

    @Post()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_MANAGE_GROUPS ])
    ])
    private async createGroup (req: InternalRequest, res: Response): Promise<void> {
        const payload = GroupView.of(req);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const entity = GroupEntity.newBuilder()
            .withName(payload.getName())
            .withImmunity(payload.getImmunity())
            .withDisplayName(payload.getDisplayName())
            .withBarStyle(payload.getBarStyle())
            .withNameColor(payload.getNameColor())
            .withStaffPermissions(PermissionHelper.getConvertedStaffPermissionsToNumber(payload.getStaffPermissions()))
            .withAdminPermissions(PermissionHelper.getConvertedAdminPermissionsToNumber(payload.getAdminPermissions()))
            .build();

        await req.serviceConfig.groupRepository.saveGroup(entity);

        const updatedEntity = await req.serviceConfig.groupRepository.saveGroup(entity).catch(reason => {
            throw reason;
        });

        await Logger.createAdminLog(req, {
            id: LogTypes.CREATED_GROUP,
            contentId: updatedEntity.groupId,
            userId: req.user.userId,
            beforeChange: null,
            afterChange: JSON.stringify(updatedEntity)
        });

        res.status(OK).json(updatedEntity.groupId);
    }

    @Put(':groupId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_MANAGE_GROUPS ])
    ])
    private async updateGroup (req: InternalRequest, res: Response): Promise<void> {
        const group = await req.serviceConfig.groupRepository.getGroupById(Number(req.params.groupId));
        if (!group) {
            res.status(NOT_FOUND).json();
            return;
        }

        const payload = GroupView.of(req);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const updatedGroup = group.newBuilderFromCurrent()
            .withName(payload.getName())
            .withImmunity(payload.getImmunity())
            .withDisplayName(payload.getDisplayName())
            .withBarStyle(payload.getBarStyle())
            .withNameColor(payload.getNameColor())
            .withStaffPermissions(PermissionHelper.getConvertedStaffPermissionsToNumber(payload.getStaffPermissions()))
            .withAdminPermissions(PermissionHelper.getConvertedAdminPermissionsToNumber(payload.getAdminPermissions()))
            .build();

        await req.serviceConfig.groupRepository.saveGroup(updatedGroup);

        const updatedEntity = await req.serviceConfig.groupRepository.saveGroup(updatedGroup).catch(reason => {
            throw reason;
        });

        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_GROUP,
            contentId: updatedEntity.groupId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(group),
            afterChange: JSON.stringify(updatedGroup)
        });

        res.status(OK).json();
    }

    @Delete(':groupId')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_MANAGE_GROUPS ])
    ])
    private async deleteGroup (req: InternalRequest, res: Response): Promise<void> {
        const group = await req.serviceConfig.groupRepository.getGroupById(Number(req.params.groupId));
        if (!group) {
            res.status(NOT_FOUND).json();
            return;
        }

        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        if (immunity <= group.immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        await req.serviceConfig.groupRepository.deleteGroup(group);

        await Logger.createAdminLog(req, {
            id: LogTypes.DELETED_GROUP,
            contentId: group.groupId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(group),
            afterChange: null
        });

        res.status(OK).json();
    }
}
