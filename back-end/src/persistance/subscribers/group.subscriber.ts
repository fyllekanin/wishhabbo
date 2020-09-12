import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { GroupEntity } from '../entities/group/group.entity';
import { GroupRepository } from '../repositories/group.repository';
import { UserRepository } from '../repositories/user/user.repository';
import { SettingRepository } from '../repositories/setting.repository';
import { SettingKey } from '../entities/settings/setting.entity';
import { StaffListModel } from '../entities/settings/models/staff-list.model';

@EventSubscriber()
export class GroupSubscriber implements EntitySubscriberInterface {

    listenTo (): any {
        return GroupEntity;
    }

    async afterRemove (event: RemoveEvent<GroupEntity>): Promise<void> {
        if (!event.entityId) {
            return;
        }
        await this.removeUserGroupsAndDisplayGroupId(event.entityId);
        await this.removeGroupFromStaffList(event.entityId);
    }

    private async removeGroupFromStaffList (groupId: number): Promise<void> {
        const settingRepository = new SettingRepository();
        const setting = await settingRepository.getSetting<StaffListModel>(SettingKey.STAFF_LIST);
        const value = setting.getParsedValue();
        if (!value) {
            return;
        }

        const updated = setting.newBuilderFromCurrent()
            .withValue({ entries: value.entries.filter(entry => entry.groupId !== groupId) })
            .build();
        await settingRepository.save(updated);
    }

    private async removeUserGroupsAndDisplayGroupId (groupId: number): Promise<void> {
        const groupRepository = new GroupRepository();
        const userRepository = new UserRepository();
        await groupRepository.deleteUsersFromGroup(groupId);
        await userRepository.removeDisplayGroupId(groupId);
    }
}
