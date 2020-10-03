import { ServiceConfig } from '../../../utilities/internal.request';
import { GroupEntity } from '../../entities/group/group.entity';

export class UserGroupOrchestrator {

    static async getAmountOfMembersWithStaffPermissions (serviceConfig: ServiceConfig): Promise<number> {
        const groups = await serviceConfig.groupRepository.getGroups();
        const groupIds = groups.filter(group => group.staffPermissions > 0).map(group => group.groupId);

        return await serviceConfig.userGroupRepository.getAmountOfUsersWithGroupIds(groupIds);
    }

    static async getUserIdsWithMoreOrEqualImmunity (serviceConfig: ServiceConfig, immunity: number): Promise<Array<number>> {
        const groups = await serviceConfig.groupRepository.getGroupsWithMoreOrEqual(immunity);
        if (groups.length === 0) {
            return serviceConfig.groupRepository.getSuperAdmins();
        }
        const userIds = await serviceConfig.userGroupRepository
            .getUserGroupsWhereInGroupid(groups.map(group => group.groupId))
            .then(result => result.map(userGroup => userGroup.userId)
                .concat(serviceConfig.groupRepository.getSuperAdmins()));
        return [...new Set(userIds)];
    }

    static async getGroupsByUser (serviceConfig: ServiceConfig, userId: number): Promise<Array<GroupEntity>> {
        const groupIds = await serviceConfig.userGroupRepository.getGroupIdsFromUser(userId);
        return await serviceConfig.groupRepository.getGroupsInIds(groupIds);
    }

    static async doUserHaveAdminPermission (serviceConfig: ServiceConfig, userId: number, permission: number): Promise<boolean> {
        if (serviceConfig.groupRepository.getSuperAdmins().includes(userId)) {
            return true;
        }
        const groupIds = await serviceConfig.userGroupRepository.getGroupIdsFromUser(userId);
        return groupIds.length > 0 && await serviceConfig.groupRepository.doAnyGroupIdHaveAdminPermission(groupIds, permission);
    }

    static async doUserHaveStaffPermission (serviceConfig: ServiceConfig, userId: number, permission: number): Promise<boolean> {
        if (serviceConfig.groupRepository.getSuperAdmins().includes(userId)) {
            return true;
        }
        const groupIds = await serviceConfig.userGroupRepository.getGroupIdsFromUser(userId);
        return groupIds.length > 0 && await serviceConfig.groupRepository.doAnyGroupIdHaveStaffPermission(groupIds, permission);
    }

    static async doUserHaveAnyStaffPermission (serviceConfig: ServiceConfig, userId: number): Promise<boolean> {
        if (serviceConfig.groupRepository.getSuperAdmins().includes(userId)) {
            return true;
        }
        const groupIds = await serviceConfig.userGroupRepository.getGroupIdsFromUser(userId);
        const groups = groupIds.length > 0 ? await serviceConfig.groupRepository.getGroupsInIds(groupIds) : [];
        return groups.some(group => group.staffPermissions > 0);
    }

    static async doUserHaveAnyAdminPermission (serviceConfig: ServiceConfig, userId: number): Promise<boolean> {
        if (serviceConfig.groupRepository.getSuperAdmins().includes(userId)) {
            return true;
        }
        const groupIds = await serviceConfig.userGroupRepository.getGroupIdsFromUser(userId);
        const groups = groupIds.length > 0 ? await serviceConfig.groupRepository.getGroupsInIds(groupIds) : [];
        return groups.some(group => group.adminPermissions > 0);
    }

    static async getImmunityByUserId (serviceConfig: ServiceConfig, userId: number): Promise<number> {
        if (serviceConfig.groupRepository.getSuperAdmins().includes(userId)) {
            return 101;
        }
        const groups = await this.getGroupsByUser(serviceConfig, userId);
        return groups.reduce((prev, curr) => {
            if (curr.immunity > prev) {
                return curr.immunity;
            }
            return prev;
        }, 0);
    }
}
