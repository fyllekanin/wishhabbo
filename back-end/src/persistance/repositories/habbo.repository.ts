import { Equal, getConnection, Repository } from 'typeorm';
import { HabboBadgeEntity } from '../entities/habbo/habbo-badge.entity';
import { BaseRepository } from './base.repository';
import { BadgeCompleteEntity } from '../entities/habbo/badge-complete.entity';

export class HabboRepository extends BaseRepository<HabboBadgeEntity> {
    private habboBadgeRepository: Repository<HabboBadgeEntity>;
    private badgeCompleteRepository: Repository<BadgeCompleteEntity>;

    async saveAll (entities: Array<HabboBadgeEntity>): Promise<Array<HabboBadgeEntity>> {
        return await this.getRepository().save(entities);
    }

    async doBadgeIdExist (badgeId: string): Promise<boolean> {
        return await this.getRepository().count({ badgeId: Equal(badgeId) }) > 0;
    }

    async isBadgeCompleted (userId: number, badgeId: string): Promise<boolean> {
        if (userId < 1) {
            return false;
        }
        return await this.getBadgeCompleteRepository()
            .count({ badgeId: badgeId, userId: userId }) > 0;
    }

    async saveBadgeComplete (entities: Array<BadgeCompleteEntity>): Promise<void> {
        await this.getBadgeCompleteRepository().save(entities);
    }

    protected getRepository (): Repository<HabboBadgeEntity> {
        if (this.habboBadgeRepository) {
            return this.habboBadgeRepository;
        }
        this.habboBadgeRepository = getConnection().getRepository(HabboBadgeEntity);
        return this.habboBadgeRepository;
    }

    private getBadgeCompleteRepository (): Repository<BadgeCompleteEntity> {
        if (this.badgeCompleteRepository) {
            return this.badgeCompleteRepository;
        }
        this.badgeCompleteRepository = getConnection().getRepository(BadgeCompleteEntity);
        return this.badgeCompleteRepository;
    }
}
