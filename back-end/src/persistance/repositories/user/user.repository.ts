import { UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';

export class UserRepository {
    private repository: Repository<UserEntity>;

    constructor () {
        this.repository = getConnection().getRepository(UserEntity);
    }

    async getUserWithUsername (username: string): Promise<UserEntity> {
        return await this.repository.findOne({ username: username });
    }

    async getUserById (userId: number): Promise<UserEntity> {
        return await this.repository.findOne({ userId: userId });
    }

    async save (entity: UserEntity): Promise<UserEntity> {
        return await this.repository.save(entity);
    }
}
