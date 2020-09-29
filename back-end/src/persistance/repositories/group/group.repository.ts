import { getConnection, In, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { GroupEntity } from '../../entities/group/group.entity';
import { BaseRepository } from '../base.repository';

const SUPER_ADMINS = [
    1
];

export class GroupRepository extends BaseRepository<GroupEntity> {
    private repository: Repository<GroupEntity>;

    getSuperAdmins (): Array<number> {
        return [...SUPER_ADMINS];
    }

    async getGroupsWithMoreOrEqual (immunity: number): Promise<Array<GroupEntity>> {
        return await this.getRepository().find({
            immunity: MoreThanOrEqual(immunity)
        });
    }

    async getGroups (): Promise<Array<GroupEntity>> {
        return await this.getRepository().find({
            cache: true
        });
    }

    async getGroupById (groupId: number): Promise<GroupEntity> {
        return await this.getRepository().findOne({
            cache: true,
            where: { groupId: groupId }
        });
    }

    async deleteGroup (group: GroupEntity): Promise<GroupEntity> {
        return await this.getRepository().remove(group);
    }

    async saveGroup (entity: GroupEntity): Promise<GroupEntity> {
        return await this.getRepository().save(entity);
    }

    async doAnyGroupIdHaveAdminPermission (groupIds: Array<number>, permission: number)
        : Promise<boolean> {
        return await this.getRepository().count({
            cache: true,
            where: {
                groupId: In(groupIds),
                adminPermissions: Raw(() => `(adminPermissions & ${permission})`)
            }
        }) > 0;
    }

    async doAnyGroupIdHaveStaffPermission (groupIds: Array<number>, permission: number)
        : Promise<boolean> {
        return await this.getRepository().count({
            cache: true,
            where: {
                groupId: In(groupIds),
                staffPermissions: Raw(() => `(staffPermissions & ${permission})`)
            }
        }) > 0;
    }

    async getGroupsInIds (groupIds: Array<number>): Promise<Array<GroupEntity>> {
        return await this.getRepository().find({
            cache: true,
            where: { groupId: In(groupIds) }
        });
    }

    protected getRepository (): Repository<GroupEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(GroupEntity);
        return this.repository;
    }
}
