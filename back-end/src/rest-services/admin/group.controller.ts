import { Controller, Get, Middleware } from '@overnightjs/core';
import { InternalRequest } from '../../utilities/internal.request';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../middlewares/admin-permission.middleware';
import { Permissions } from '../../constants/permissions.constant';
import { OK } from 'http-status-codes';
import { PaginationView } from '../../rest-service-views/respond-views/pagination.view';
import { PaginationHelper } from '../../helpers/pagination.helper';
import { GroupView } from '../../rest-service-views/group.view';

@Controller('api/admin/groups')
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
        const filteredOnImmunity = groups.filter(group => group.immunity < immunity);

        const start = PaginationHelper.getSkip(page, GroupController.GROUP_PER_PAGE);
        const end = start + GroupController.GROUP_PER_PAGE;
        const items = filteredOnImmunity.slice(start, end).map(item => GroupView.newBuilder()
            .withGroupId(item.groupId)
            .withName(item.name)
            .withImmunity(item.immunity)
            .withDisplayName(item.displayName)
            .withDescription(item.description)
            .withCreatedAt(item.createdAt)
            .withUpdatedAt(item.updatedAt));

        res.status(OK).json(PaginationView.newBuilder()
            .withItems(items)
            .withPage(page)
            .withTotal(PaginationHelper.getTotalAmountOfPages(GroupController.GROUP_PER_PAGE, filteredOnImmunity.length))
            .build());
    }
}
