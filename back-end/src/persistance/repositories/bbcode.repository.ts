import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BbcodeEntity } from '../entities/settings/bbcode.entity';

export class BbcodeRepository extends BaseRepository<BbcodeEntity> {
    private repository: Repository<BbcodeEntity>;

    async parseContent(content: string): Promise<string> {
        return await this.getAll().then(bbcodes => {
            return bbcodes.map(bbcode => ({ regex: new RegExp(bbcode.pattern, 'igm'), replacement: bbcode.replacement }))
                .reduce((prev, curr) => prev.replace(curr.regex, curr.replacement), content);
        });
    }

    protected getRepository (): Repository<BbcodeEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(BbcodeEntity);
        return this.repository;
    }
}
