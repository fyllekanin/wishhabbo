import { DeleteResult, getConnection, In, Raw, Repository } from 'typeorm';
import { GroupEntity } from '../entities/group/group.entity';
import { UserGroupEntity } from '../entities/group/user-group.entity';

const SUPER_ADMINS = [
    1
];

export class GroupRepository {
    private groupRepository: Repository<GroupEntity>;
    private userGroupRepository: Repository<UserGroupEntity>;

    constructor () {
        this.groupRepository = getConnection().getRepository(GroupEntity);
        this.userGroupRepository = getConnection().getRepository(UserGroupEntity);
    }

    async getUserIdImmunity (userId: number): Promise<number> {
        if (SUPER_ADMINS.includes(userId)) {
            return 101;
        }
        const groups = await this.getGroupsUserHave(userId);
        return groups.reduce((prev, curr) => {
            if (curr.immunity > prev) {
                return curr.immunity;
            }
            return prev;
        }, 0);
    }

    async getGroups (): Promise<Array<GroupEntity>> {
        return await this.groupRepository.find({
            cache: true
        });
    }

    async getGroupById (groupId: number): Promise<GroupEntity> {
        return await this.groupRepository.findOne({
            cache: true,
            where: { groupId: groupId }
        });
    }

    async deleteGroup (group: GroupEntity): Promise<GroupEntity> {
        return await this.groupRepository.remove(group);
    }

    async addGroupToUser (groupId: number, userId: number): Promise<void> {
        const entity = UserGroupEntity.newBuilder()
            .withGroupId(groupId)
            .withUserId(userId)
            .build();

        await this.userGroupRepository.save(entity);
    }

    async deleteGroupFromUser (groupId: number, userId: number): Promise<DeleteResult> {
        return await this.userGroupRepository.delete({
            userId: userId,
            groupId: groupId
        });
    }

    async deleteUsersFromGroup (groupId: number): Promise<DeleteResult> {
        return await this.userGroupRepository.delete({
            groupId: groupId
        });
    }

    async saveGroup (entity: GroupEntity): Promise<GroupEntity> {
        return await this.groupRepository.save(entity);
    }

    async haveAdminPermission (userId: number, permission: number): Promise<boolean> {
        if (SUPER_ADMINS.includes(userId)) {
            return true;
        }

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
        if (SUPER_ADMINS.includes(userId)) {
            return true;
        }

        const groupIds = await this.getGroupIdsFromUser(userId);
        if (groupIds.length === 0) {
            return false;
        }
        return await this.groupRepository.count({
            cache: true,
            where: { groupId: In(groupIds), staffPermissions: Raw(() => `(staffPermissions & ${permission})`) }
        }) > 0;
    }

    async getGroupsUserHave (userId: number): Promise<Array<GroupEntity>> {
        const groupIds = await this.getGroupIdsFromUser(userId);
        return await this.groupRepository.find({
            cache: true,
            where: { groupId: In(groupIds) }
        });
    }

    private async getGroupIdsFromUser (userId: number): Promise<Array<number>> {
        const userGroups = await this.userGroupRepository.find({
            cache: true,
            where: { userId: userId }
        });
        return userGroups.map(userGroup => userGroup.groupId);
    }
}
