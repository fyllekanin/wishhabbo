import { Controller, Get, Middleware } from '@overnightjs/core';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { NOT_FOUND, OK } from 'http-status-codes';
import { PaginationView } from '../../../rest-service-views/respond-views/pagination.view';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { GroupView } from '../../../rest-service-views/group.view';
import { PermissionHelper } from '../../../helpers/permission.helper';

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
}
