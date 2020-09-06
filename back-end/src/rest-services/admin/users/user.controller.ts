import { Controller, Get, Middleware } from '@overnightjs/core';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { PaginationHelper } from '../../../helpers/pagination.helper';
import { OK } from 'http-status-codes';
import { SlimUserView } from '../../../rest-service-views/slim-user.view';
import { PaginationView } from '../../../rest-service-views/respond-views/pagination.view';

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
                { key: 'userId', operator: null, isNotIn: true, value: skipUserIds.join(', ') }
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
}
