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
import { UserGroupsView, UserGroupsViewGroup } from '../../../rest-service-views/two-way/admin/user-groups.view';
import { PaginationValue, RequestUtility } from '../../../utilities/request.utility';
import { PaginationWhereOperators } from '../../../persistance/repositories/base.repository';
import { UserGroupOrchestrator } from '../../../persistance/repositories/group/user-group.orchestrator';

@Controller('api/admin/users/users')
export class UserController {
    private static readonly SUPPORTED_SEARCH_VALUES: Array<PaginationValue> = [
        { key: 'username', operator: PaginationWhereOperators.LIKE },
        { key: 'habbo', operator: PaginationWhereOperators.LIKE }
    ];

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
        const immunity = await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, req.user.userId);
        const skipUserIds = await UserGroupOrchestrator.getUserIdsWithMoreOrEqualImmunity(req.serviceConfig, immunity);

        const data = await req.serviceConfig.userRepository.paginate({
            take: PaginationHelper.TWENTY_ITEMS,
            page: Number(req.params.page),
            where: RequestUtility.getPaginationWheresFromQuery(req, UserController.SUPPORTED_SEARCH_VALUES)
                .concat([
                    { key: 'userId', operator: null, isNotIn: true, value: skipUserIds }
                ]),
            orderBy: {
                sort: 'username',
                order: 'ASC'
            }
        });
        const users: Array<SlimUserView> = [];
        for (const user of data.getItems()) {
            users.push(await req.serviceConfig.userRepository.getSlimUserById(user.userId));
        }

        res.status(OK).json(PaginationView.newBuilder()
            .withItems(users)
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
        const immunity = await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, req.user.userId);
        const userImmunity = user ? await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const userdata = await req.serviceConfig.userRepository.getUserdataByUserId(user.userId);
        res.status(OK).json({
            userId: user.userId,
            username: user.username,
            habbo: user.habbo,
            role: userdata.role
        });
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
        const immunity = await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, req.user.userId);
        const userImmunity = user ? await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const groupIds = await req.serviceConfig.userGroupRepository.getGroupIdsFromUser(user.userId);
        const groups: Array<UserGroupsViewGroup> =
            await req.serviceConfig.groupRepository.getGroups()
                .then(items => items
                    .sort((a, b) => a.name > b.name ? 1 : -1)
                    .filter(group => group.immunity < immunity)
                    .map(group => ({
                            name: group.name,
                            groupId: group.groupId,
                            isSelected: groupIds.includes(group.groupId)
                        })
                    ));

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
        const immunity = await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, req.user.userId);
        const userImmunity = user ? await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }

        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const groupIdsBefore = await req.serviceConfig.userGroupRepository.getGroupIdsFromUser(user.userId);
        await req.serviceConfig.userGroupRepository.deleteGroupsFromUser(user.userId);
        const promises = payload.getSelectedGroupIds()
            .map(groupId => req.serviceConfig.userGroupRepository.addGroupToUser(groupId, user.userId));
        await Promise.all(promises);
        user.displayGroupId = payload.getDisplayGroupId();
        await req.serviceConfig.userRepository.save(user);

        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_USER_GROUPS,
            contentId: user.userId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(groupIdsBefore),
            afterChange: JSON.stringify(payload.getSelectedGroupIds())
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
        const userdata = await req.serviceConfig.userRepository.getUserdataByUserId(user.userId);
        const immunity = await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, req.user.userId);
        const userImmunity = user ? await UserGroupOrchestrator.getImmunityByUserId(req.serviceConfig, user.userId) : 0;
        if (!user || userImmunity >= immunity) {
            res.status(NOT_FOUND).json();
            return;
        }
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const builder = user.newBuilderFromCurrent()
            .withUsername(payload.getUsername())
            .withHabbo(payload.getHabbo());

        let userdataUpdated = null;
        if (await UserGroupOrchestrator.doUserHaveAdminPermission(
            req.serviceConfig,
            req.user.userId,
            Permissions.ADMIN.CAN_MANAGE_USER_ADVANCED)) {
            builder.withPassword(await HasherUtility.hash(payload.getPassword()));

            if (payload.getRole()) {
                userdataUpdated = userdata.newBuilderFromCurrent()
                    .withRole(payload.getRole())
                    .build();
                await req.serviceConfig.userRepository.saveUserdata(userdataUpdated);
            }
        }
        const updated = builder.build();
        const isPasswordUpdated = Boolean(payload.getPassword());

        await req.serviceConfig.userRepository.save(updated);
        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_USER_DETAILS,
            contentId: updated.userId,
            userId: req.user.userId,
            beforeChange: JSON.stringify({
                user: user.newBuilderFromCurrent()
                    .withPassword(isPasswordUpdated ? 'changed' : null).build(),
                userdata: userdata
            }),
            afterChange: JSON.stringify({
                user: updated.newBuilderFromCurrent()
                    .withPassword(isPasswordUpdated ? 'changed' : null).build(),
                userdata: userdataUpdated
            })
        });
        res.status(OK).json();
    }
}
