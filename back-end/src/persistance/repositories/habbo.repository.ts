import { Equal, getConnection, Repository } from 'typeorm';
import { HabboBadgeEntity } from '../entities/habbo/habbo-badge.entity';

export class HabboRepository {
    private habboBadgeRepository: Repository<HabboBadgeEntity>;

    async saveAll (entities: Array<HabboBadgeEntity>): Promise<Array<HabboBadgeEntity>> {
        return await this.getRepository().save(entities);
    }

    async doBadgeIdExist (badgeId: string): Promise<boolean> {
        return await this.getRepository().count({ badgeId: Equal(badgeId) }) > 0;
    }

    private getRepository (): Repository<HabboBadgeEntity> {
        if (this.habboBadgeRepository) {
            return this.habboBadgeRepository;
        }
        this.habboBadgeRepository = getConnection().getRepository(HabboBadgeEntity);
        return this.habboBadgeRepository;
    }
}
