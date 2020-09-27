import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BbcodeEntity } from '../entities/settings/bbcode.entity';

export class BbcodeRepository extends BaseRepository<BbcodeEntity> {
    private repository: Repository<BbcodeEntity>;

    async parseContent(content: string): Promise<string> {
        const preparedContent = this.getPreparedContent(content);

        return await this.getAll().then(bbcodes => {
            return bbcodes.map(bbcode => ({ regex: new RegExp(bbcode.pattern, 'gims'), replacement: bbcode.replacement }))
                .reduce((prev, curr) => prev.replace(curr.regex, curr.replacement), preparedContent);
        });
    }

    protected getRepository (): Repository<BbcodeEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(BbcodeEntity);
        return this.repository;
    }

    private getPreparedContent(content: string): string {
        return `<span style="white-space: pre-line">${content
            .replace(new RegExp('>', 'gmi'), '&#62;')
            .replace(new RegExp('<', 'gmi'), '&#60;')}</span>`;
    }
}
