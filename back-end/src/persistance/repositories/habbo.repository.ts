import { Equal, getConnection, Repository } from 'typeorm';
import { HabboBadgeEntity } from '../entities/habbo/habbo-badge.entity';

export class HabboRepository {
    private habboBadgeRepository: Repository<HabboBadgeEntity>;

    constructor () {
        this.habboBadgeRepository = getConnection().getRepository(HabboBadgeEntity);
    }

    async saveAll (entities: Array<HabboBadgeEntity>): Promise<Array<HabboBadgeEntity>> {
        return await this.habboBadgeRepository.save(entities);
    }

    async doBadgeIdExist (badgeId: string): Promise<boolean> {
        return await this.habboBadgeRepository.count({ badgeId: Equal(badgeId) }) > 0;
    }
}
