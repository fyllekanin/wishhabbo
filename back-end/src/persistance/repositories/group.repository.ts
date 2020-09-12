import { DeleteResult, getConnection, In, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { GroupEntity } from '../entities/group/group.entity';
import { UserGroupEntity } from '../entities/group/user-group.entity';

const SUPER_ADMINS = [
    1
];

export class GroupRepository {
    private groupRepository: Repository<GroupEntity>;
    private userGroupRepository: Repository<UserGroupEntity>;

    async getUserIdsWithSameOrHigherImmunity (immunity: number): Promise<Array<number>> {
        const groups = await this.getGroupRepository().find({
            immunity: MoreThanOrEqual(immunity)
        });
        if (groups.length === 0) {
            return SUPER_ADMINS;
        }
        const userGroups = await this.getUserGroupRepository().find({
            where: {
                groupId: In(groups.map(group => group.groupId))
            }
        });
        const userIds = userGroups.map(userGroup => userGroup.userId).concat(SUPER_ADMINS);
        return [ ...new Set(userIds) ];
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
        return await this.getGroupRepository().find({
            cache: true
        });
    }

    async getGroupById (groupId: number): Promise<GroupEntity> {
        return await this.getGroupRepository().findOne({
            cache: true,
            where: { groupId: groupId }
        });
    }

    async getUserIdsWithGroup (groupId: number): Promise<Array<number>> {
        return await this.getUserGroupRepository().find({
            where: { groupId: groupId }
        }).then(userGroups => userGroups.map(userGroup => userGroup.userId));
    }

    async deleteGroup (group: GroupEntity): Promise<GroupEntity> {
        return await this.getGroupRepository().remove(group);
    }

    async addGroupToUser (groupId: number, userId: number): Promise<void> {
        const entity = UserGroupEntity.newBuilder()
            .withGroupId(groupId)
            .withUserId(userId)
            .build();

        await this.getUserGroupRepository().save(entity);
    }

    async deleteGroupsFromUser (userId: number): Promise<void> {
        await this.getUserGroupRepository().delete({
            userId: userId
        });
    }

    async deleteUsersFromGroup (groupId: number): Promise<DeleteResult> {
        return await this.getUserGroupRepository().delete({
            groupId: groupId
        });
    }

    async saveGroup (entity: GroupEntity): Promise<GroupEntity> {
        return await this.getGroupRepository().save(entity);
    }

    async haveAdminPermission (userId: number, permission: number): Promise<boolean> {
        if (SUPER_ADMINS.includes(userId)) {
            return true;
        }

        const groupIds = await this.getGroupIdsFromUser(userId);
        if (groupIds.length === 0) {
            return false;
        }
        return await this.getGroupRepository().count({
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
        return await this.getGroupRepository().count({
            cache: true,
            where: { groupId: In(groupIds), staffPermissions: Raw(() => `(staffPermissions & ${permission})`) }
        }) > 0;
    }

    async getGroupsUserHave (userId: number): Promise<Array<GroupEntity>> {
        const groupIds = await this.getGroupIdsFromUser(userId);
        return await this.getGroupRepository().find({
            cache: true,
            where: { groupId: In(groupIds) }
        });
    }

    async getGroupIdsFromUser (userId: number): Promise<Array<number>> {
        const userGroups = await this.getUserGroupRepository().find({
            cache: true,
            where: { userId: userId }
        });
        return userGroups.map(userGroup => userGroup.groupId);
    }

    private getGroupRepository (): Repository<GroupEntity> {
        if (this.groupRepository) {
            return this.groupRepository;
        }
        this.groupRepository = getConnection().getRepository(GroupEntity);
        return this.groupRepository;
    }

    private getUserGroupRepository (): Repository<UserGroupEntity> {
        if (this.userGroupRepository) {
            return this.userGroupRepository;
        }
        this.userGroupRepository = getConnection().getRepository(UserGroupEntity);
        return this.userGroupRepository;
    }
}
