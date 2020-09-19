import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BbcodeEntity } from '../entities/settings/bbcode.entity';

export class BbcodeRepository extends BaseRepository<BbcodeEntity> {
    private repository: Repository<BbcodeEntity>;

    protected getRepository (): Repository<BbcodeEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(BbcodeEntity);
        return this.repository;
    }
}
