import { getConnection, Repository } from 'typeorm';
import { ArticleEntity } from '../../../entities/staff/media/article.entity';
import { BaseRepository } from '../../base.repository';

export class ArticleRepository extends BaseRepository<ArticleEntity> {
    protected repository: Repository<ArticleEntity>;

    constructor () {
        super();
        this.repository = getConnection().getRepository(ArticleEntity);
    }

    async getByArticleId (articleId: number): Promise<ArticleEntity> {
        return await this.repository.findOne({ articleId: articleId });
    }
}
