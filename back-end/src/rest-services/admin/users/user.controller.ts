import { Controller, Get, Middleware, Put } from '@overnightjs/core';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { SlimUserView } from '../../../rest-service-views/two-way/slim-user.view';
import { PaginationView } from '../../../rest-service-views/respond-views/pagination.view';
import { UserDetailsPayload } from '../../../rest-service-views/payloads/admin/users/user-details.payload';
import { ValidationValidators } from '../../../validation/validation.validators';
import { HasherUtility } from '../../../utilities/hasher.utility';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';
import { UserGroupsView } from '../../../rest-service-views/two-way/user-groups.view';

@Controller('api/admin/users/users')
export class UserController {

    @Get('page/:page')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([
            Permissions.ADMIN.CAN_MANAGE_USER_BASICS,
            Permissions.ADMIN.CAN_MANAGE_USER_GROUPS,
            Permissions.ADMIN.CAN_MANAGE_USER_ADVANCED
        ])
    ])
    private async getUsers (req: InternalRequest, res: Response): Promise<void> {
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const skipUserIds = await req.serviceConfig.groupRepository.getUserIdsWithSameOrHigherImmunity(immunity);
        const data = await req.serviceConfig.userRepository.paginate({
            take: PaginationHelper.TWENTY_ITEMS,
            page: Number(req.params.page),
            where: [
                { key: 'userId', operator: null, isNotIn: true, value: skipUserIds }
            ],
            orderBy: {
                sort: 'username',
                order: 'ASC'
            }
        });

        res.status(OK).json(PaginationView.newBuilder()
            .withItems(data.getItems().map(user => SlimUserView.newBuilder()
                .withUserId(user.userId)
                .withUsername(user.username)
                .withHabbo(user.habbo)
                .withUpdatedAt(user.updatedAt)
                .build()))
            .withPage(data.getPage())
            .withTotal(data.getTotal())
            .build());
    }

    @Get(':userId/details')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([
            Permissions.ADMIN.CAN_MANAGE_USER_BASICS,
            Permissions.ADMIN.CAN_MANAGE_USER_ADVANCED
        ])
    ])
    private async getUserDetails (req: InternalRequest, res: Response): Promise<void> {
        const user = await req.serviceConfig.userRepository.getUserById(Number(req.params.userId));
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const userImmunity = user ? await req.serviceConfig.groupRepository.getUserIdImmunity(user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        res.status(OK).json(SlimUserView.newBuilder()
            .withUsername(user.username)
            .withUserId(user.userId)
            .withHabbo(user.habbo)
            .build());
    }

    @Get(':userId/groups')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([
            Permissions.ADMIN.CAN_MANAGE_USER_GROUPS
        ])
    ])
    private async getUserGroups (req: InternalRequest, res: Response): Promise<void> {
        const user = await req.serviceConfig.userRepository.getUserById(Number(req.params.userId));
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const userImmunity = user ? await req.serviceConfig.groupRepository.getUserIdImmunity(user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const groupIds = await req.serviceConfig.groupRepository.getGroupIdsFromUser(user.userId);
        const groups: Array<{ name: string, groupId: number }> = await req.serviceConfig.groupRepository.getGroupsByIds(groupIds)
            .then(items => items.map(group => ({ name: group.name, groupId: group.groupId })));

        res.status(OK).json(UserGroupsView.newBuilder()
            .withUsername(user.username)
            .withUserId(user.userId)
            .withDisplayGroupId(user.displayGroupId)
            .withGroups(groups)
            .build());
    }

    @Put(':userId/groups')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([
            Permissions.ADMIN.CAN_MANAGE_USER_GROUPS
        ])
    ])
    private async updateUserGroups (req: InternalRequest, res: Response): Promise<void> {
        const payload = UserGroupsView.of(req);
        const user = await req.serviceConfig.userRepository.getUserById(payload.getUserId());
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const userImmunity = user ? await req.serviceConfig.groupRepository.getUserIdImmunity(user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const groupIdsBefore = await req.serviceConfig.groupRepository.getGroupIdsFromUser(user.userId);
        await req.serviceConfig.groupRepository.deleteGroupsFromUser(user.userId);
        const promises = payload.getGroupIds().map(groupId => req.serviceConfig.groupRepository.addGroupToUser(groupId, user.userId));
        await Promise.all(promises);
        user.displayGroupId = payload.getDisplayGroupId();
        await req.serviceConfig.userRepository.save(user);

        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_USER_GROUPS,
            contentId: user.userId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(groupIdsBefore),
            afterChange: JSON.stringify(payload.getGroupIds())
        });
        res.status(OK).json();
    }

    @Put(':userId/details')
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([
            Permissions.ADMIN.CAN_MANAGE_USER_BASICS,
            Permissions.ADMIN.CAN_MANAGE_USER_ADVANCED
        ])
    ])
    private async updateUserDetails (req: InternalRequest, res: Response): Promise<void> {
        const payload = UserDetailsPayload.of(req);
        const user = await req.serviceConfig.userRepository.getUserById(payload.getUserId());
        const immunity = await req.serviceConfig.groupRepository.getUserIdImmunity(req.user.userId);
        const userImmunity = user ? await req.serviceConfig.groupRepository.getUserIdImmunity(user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const builder = user.newBuilderFromCurrent()
            .withUsername(payload.getUsername())
            .withHabbo(payload.getHabbo());

        if (await req.serviceConfig.groupRepository.haveAdminPermission(req.user.userId, Permissions.ADMIN.CAN_MANAGE_USER_ADVANCED)) {
            builder.withPassword(await HasherUtility.hash(payload.getPassword()));
        }
        const updated = builder.build();
        const isPasswordUpdated = Boolean(payload.getPassword());

        await req.serviceConfig.userRepository.save(updated);
        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_USER_DETAILS,
            contentId: updated.userId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(user.newBuilderFromCurrent()
                .withPassword(isPasswordUpdated ? 'changed' : null).build()),
            afterChange: JSON.stringify(updated.newBuilderFromCurrent()
                .withPassword(isPasswordUpdated ? 'changed' : null).build())
        });
        res.status(OK).json();
    }
}
