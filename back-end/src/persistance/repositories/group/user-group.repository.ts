import { DeleteResult, getConnection, In, Repository } from 'typeorm';
import { UserGroupEntity } from '../../entities/group/user-group.entity';
import { BaseRepository } from '../base.repository';

export class UserGroupRepository extends BaseRepository<UserGroupEntity> {
    private repository: Repository<UserGroupEntity>;

    async getUserIdsWithGroup (groupId: number): Promise<Array<number>> {
        return await this.getRepository().find({
            where: { groupId: groupId }
        }).then(userGroups => userGroups.map(userGroup => userGroup.userId));
    }

    async getUserGroupsWhereInGroupid (groupIds: Array<number>): Promise<Array<UserGroupEntity>> {
        return await this.getRepository().find({
            where: {
                groupId: In(groupIds)
            }
        });
    }

    async addGroupToUser (groupId: number, userId: number): Promise<void> {
        const entity = UserGroupEntity.newBuilder()
            .withGroupId(groupId)
            .withUserId(userId)
            .build();

        await this.getRepository().save(entity);
    }

    async deleteGroupsFromUser (userId: number): Promise<void> {
        await this.getRepository().delete({
            userId: userId
        });
    }

    async deleteUsersFromGroup (groupId: number): Promise<DeleteResult> {
        return await this.getRepository().delete({
            groupId: groupId
        });
    }

    async getGroupIdsFromUser (userId: number): Promise<Array<number>> {
        const userGroups = await this.getRepository().find({
            cache: true,
            where: { userId: userId }
        });
        return userGroups.map(userGroup => userGroup.groupId);
    }


    protected getRepository (): Repository<UserGroupEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(UserGroupEntity);
        return this.repository;
    }
}
