import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { StaffListModel } from '../persistance/entities/settings/models/staff-list.model';
import { SettingKey } from '../persistance/entities/settings/setting.entity';
import { StaffListPage, StaffListRow } from '../rest-service-views/respond-views/pages/staff-list.page';
import { OK } from 'http-status-codes';
import { HomePage } from '../rest-service-views/respond-views/pages/home.page';

@Controller('api/page')
export class PageController {

    @Get('home')
    private async getHomePage (req: InternalRequest, res: Response): Promise<void> {
        const badges = await req.serviceConfig.habboRepository.paginate({
            take: 12,
            page: 1,
            orderBy: { sort: 'createdAt', order: 'DESC' }
        });
        
        res.status(OK).json(HomePage.newBuilder()
            .withBadges(badges.getItems())
            .build());
    }

    @Get('staff-list')
    private async getStaffList (req: InternalRequest, res: Response): Promise<void> {
        const staffListModel = await req.serviceConfig.settingRepository.getKeyValue<StaffListModel>(SettingKey.STAFF_LIST);
        const entries: Array<StaffListRow> = [];
        for (const entry of (staffListModel ? staffListModel.entries : [])) {
            const group = await req.serviceConfig.groupRepository.getGroupById(entry.groupId);
            const userIds = await req.serviceConfig.groupRepository.getUserIdsWithGroup(group.groupId);
            if (userIds.length === 0) {
                continue;
            }
            const users = [];
            for (const userId of userIds) {
                users.push(await req.serviceConfig.userRepository.getSlimUserById(userId));
            }

            entries.push(StaffListRow.newBuilder()
                .withGroupId(entry.groupId)
                .withDisplayOrder(entry.displayOrder)
                .withName(group.name)
                .withNameColor(group.nameColor)
                .withUsers(users)
                .build());
        }

        res.status(OK).json(StaffListPage.newBuilder().withRows(entries).build());
    }
}
