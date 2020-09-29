import { UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { SlimUserView } from '../../../rest-service-views/two-way/slim-user.view';
import { GroupRepository } from '../group/group.repository';
import { UserdataEntity } from '../../entities/user/userdata.entity';

export class UserRepository extends BaseRepository<UserEntity> {
    private userdataRepository: Repository<UserdataEntity>;
    protected repository: Repository<UserEntity>;

    async removeDisplayGroupId (groupId: number): Promise<void> {
        await this.getRepository().update({
            displayGroupId: groupId
        }, {
            displayGroupId: 0
        });
    }

    async getSlimUserById (userId: number): Promise<SlimUserView> {
        const groupRepository = new GroupRepository();
        const user = await this.getUserById(userId);
        if (!user) {
            return null;
        }

        const displayGroup = await groupRepository.getGroupById(user.displayGroupId);
        return SlimUserView.newBuilder()
            .withHabbo(user.habbo)
            .withUsername(user.username)
            .withUserId(user.userId)
            .withNameColors(displayGroup ? [displayGroup.nameColor] : [])
            .withLikes(user.likes)
            .withUpdatedAt(user.updatedAt)
            .build();
    }

    async getUserWithUsername (username: string): Promise<UserEntity> {
        return await this.getRepository().findOne({ username: username });
    }

    async getUserWithHabbo (habbo: string): Promise<UserEntity> {
        return await this.getRepository().findOne({ habbo: habbo });
    }

    async getUserById (userId: number): Promise<UserEntity> {
        return await this.getRepository().findOne({
            cache: true,
            where: { userId: userId }
        });
    }

    async getUserdataByUserId (userId: number): Promise<UserdataEntity> {
        const userdata = await this.getUserdataRepository().findOne({
            cache: true,
            where: { userId: userId }
        });
        if (userdata) {
            return userdata;
        }
        return UserdataEntity.newBuilder()
            .withUserId(userId)
            .build();
    }

    async saveUserdata (entity: UserdataEntity): Promise<void> {
        await this.getUserdataRepository().save(entity);
    }

    protected getRepository (): Repository<UserEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(UserEntity);
        return this.repository;
    }

    private getUserdataRepository (): Repository<UserdataEntity> {
        if (this.userdataRepository) {
            return this.userdataRepository;
        }
        this.userdataRepository = getConnection().getRepository(UserdataEntity);
        return this.userdataRepository;
    }
}
