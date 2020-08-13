import { UserEntity } from '../../entities/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../base.repository';

export class UserRepository extends BaseRepository<UserEntity> {
    protected repository: Repository<UserEntity>;

    constructor () {
        super();
        this.repository = getConnection().getRepository(UserEntity);
    }

    async getUserWithUsername (username: string): Promise<UserEntity> {
        return await this.repository.findOne({ username: username });
    }

    async getUserById (userId: number): Promise<UserEntity> {
        return await this.repository.findOne({ userId: userId });
    }
}
