import { UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { SlimUserView } from '../../../rest-service-views/two-way/slim-user.view';

export class UserRepository extends BaseRepository<UserEntity> {
    protected repository: Repository<UserEntity>;

    async removeDisplayGroupId (groupId: number): Promise<void> {
        await this.getRepository().update({
            displayGroupId: groupId
        }, {
            displayGroupId: 0
        });
    }

    async getSlimUserById (userId: number): Promise<SlimUserView> {
        const user = await this.getUserById(userId);
        if (!user) {
            return null;
        }

        return SlimUserView.newBuilder()
            .withHabbo(user.habbo)
            .withUsername(user.username)
            .withUserId(user.userId)
            .build();
    }

    async getUserWithUsername (username: string): Promise<UserEntity> {
        return await this.getRepository().findOne({ username: username });
    }

    async getUserWithHabbo (habbo: string): Promise<UserEntity> {
        return await this.getRepository().findOne({ habbo: habbo });
    }

    async getUserById (userId: number): Promise<UserEntity> {
        return await this.getRepository().findOne({ userId: userId });
    }

    protected getRepository (): Repository<UserEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(UserEntity);
        return this.repository;
    }
}
