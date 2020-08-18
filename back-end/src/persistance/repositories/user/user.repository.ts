import { UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { SlimUserView } from '../../../rest-service-views/respond-views/user/slim-user.view';

export class UserRepository extends BaseRepository<UserEntity> {
    protected repository: Repository<UserEntity>;

    constructor () {
        super();
        this.repository = getConnection().getRepository(UserEntity);
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
        return await this.repository.findOne({ username: username });
    }

    async getUserById (userId: number): Promise<UserEntity> {
        return await this.repository.findOne({ userId: userId });
    }
}
