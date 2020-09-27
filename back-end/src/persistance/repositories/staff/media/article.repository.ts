import { getConnection, Repository, UpdateResult } from 'typeorm';
import { ArticleEntity } from '../../../entities/staff/media/article.entity';
import { BaseRepository } from '../../base.repository';

export class ArticleRepository extends BaseRepository<ArticleEntity> {
    protected repository: Repository<ArticleEntity>;

    async getByArticleId (articleId: number): Promise<ArticleEntity> {
        return await this.getRepository().findOne({ articleId: articleId });
    }

    async update(entity: ArticleEntity): Promise<UpdateResult> {
        return await this.getRepository().update({ articleId: entity.articleId }, entity);
    }

    protected getRepository (): Repository<ArticleEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(ArticleEntity);
        return this.repository;
    }
}
