import { Controller, Get, Middleware, Put } from '@overnightjs/core';
import { AUTHORIZATION_MIDDLEWARE } from '../../middlewares/authorization.middleware';
import { GET_ADMIN_PERMISSION_MIDDLEWARE } from '../../middlewares/admin-permission.middleware';
import { Permissions } from '../../../constants/permissions.constant';
import { InternalRequest } from '../../../utilities/internal.request';
import { Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { StaffListView, StaffListViewEntry } from '../../../rest-service-views/two-way/admin/staff-list.view';
import { StaffListModel } from '../../../persistance/entities/settings/models/staff-list.model';
import { SettingKey } from '../../../persistance/entities/settings/setting.entity';
import { ValidationValidators } from '../../../validation/validation.validators';
import { Logger } from '../../../logging/log.logger';
import { LogTypes } from '../../../logging/log.types';

@Controller('api/admin/website-settings/staff-list')
export class StaffListController {

    @Get()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_EDIT_STAFF_LIST ])
    ])
    private async getStaffList (req: InternalRequest, res: Response): Promise<void> {
        const staffListModel = await req.serviceConfig.settingRepository.getKeyValue<StaffListModel>(SettingKey.STAFF_LIST);
        const selectedGroups = staffListModel && Array.isArray(staffListModel.entries) ? staffListModel.entries : [];
        const groups: Array<StaffListViewEntry> = await req.serviceConfig.groupRepository.getGroups()
            .then(items => items.map(item => {
                const selectedGroup = selectedGroups.find(selected => selected.groupId === item.groupId);
                return <StaffListViewEntry>{
                    groupId: item.groupId,
                    name: item.name,
                    nameColor: item.nameColor,
                    displayOrder: selectedGroup ? selectedGroup.displayOrder : 0,
                    isSelected: Boolean(selectedGroup)
                };
            }));

        res.status(OK).json(StaffListView.newBuilder()
            .withGroups(groups)
            .build());
    }

    @Put()
    @Middleware([
        AUTHORIZATION_MIDDLEWARE,
        GET_ADMIN_PERMISSION_MIDDLEWARE([ Permissions.ADMIN.CAN_EDIT_STAFF_LIST ])
    ])
    private async updateStaffList (req: InternalRequest, res: Response): Promise<void> {
        const payload = StaffListView.of(req);
        const errors = await ValidationValidators.validatePayload(payload, req.serviceConfig, req.user);
        const setting = await req.serviceConfig.settingRepository.getSetting(SettingKey.STAFF_LIST);
        if (errors.length > 0) {
            res.status(BAD_REQUEST).json(errors);
            return;
        }

        const updated = setting.newBuilderFromCurrent()
            .withValue({
                entries: payload.getSelectedGroups()
                    .map(group => ({ groupId: group.groupId, displayOrder: group.displayOrder }))
            })
            .build();

        await req.serviceConfig.settingRepository.save(updated);

        await Logger.createAdminLog(req, {
            id: LogTypes.UPDATED_STAFF_LIST,
            contentId: updated.settingId,
            userId: req.user.userId,
            beforeChange: JSON.stringify(setting),
            afterChange: JSON.stringify(updated)
        });
        res.status(OK).json();
    }
}
