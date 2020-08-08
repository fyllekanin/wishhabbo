import { getConnection, In, Raw, Repository } from 'typeorm';
import { GroupEntity } from '../entities/group/group.entity';
import { UserGroupEntity } from '../entities/group/user-group.entity';

export class GroupRepository {
    private groupRepository: Repository<GroupEntity>;
    private userGroupRepository: Repository<UserGroupEntity>;

    constructor () {
        this.groupRepository = getConnection().getRepository(GroupEntity);
        this.userGroupRepository = getConnection().getRepository(UserGroupEntity);
    }

    async haveAdminPermission (userId: number, permission: number): Promise<boolean> {
        const groupIds = await this.getGroupIdsFromUser(userId);
        if (groupIds.length === 0) {
            return false;
        }
        return await this.groupRepository.count({
            groupId: In(groupIds),
            adminPermissions: Raw(() => `(adminPermissions & ${permission})`)
        }) > 0;
    }

    async haveStaffPermission (userId: number, permission: number): Promise<boolean> {
        const groupIds = await this.getGroupIdsFromUser(userId);
        if (groupIds.length === 0) {
            return false;
        }
        return await this.groupRepository.count({
            groupId: In(groupIds),
            staffPermissions: Raw(() => `(staffPermissions & ${permission})`)
        }) > 0;
    }

    async getGroupsUserHave (userId: number): Promise<Array<GroupEntity>> {
        const groupIds = await this.getGroupIdsFromUser(userId);
        return await this.groupRepository.find({ groupId: In(groupIds) });
    }

    private async getGroupIdsFromUser (userId: number): Promise<Array<number>> {
        const userGroups = await this.userGroupRepository.find({ userId: userId });
        return userGroups.map(userGroup => userGroup.groupId);
    }
}
