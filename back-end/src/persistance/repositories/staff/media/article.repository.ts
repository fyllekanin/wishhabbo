import { getConnection, Repository, UpdateResult } from 'typeorm';
import { ArticleEntity } from '../../../entities/staff/media/article.entity';
import { BaseRepository } from '../../base.repository';

export class ArticleRepository extends BaseRepository<ArticleEntity> {
    protected repository: Repository<ArticleEntity>;

    async getArticleCount (userId: number): Promise<number> {
        return await this.getRepository().count({ userId: userId });
    }

    async getByArticleId (articleId: number): Promise<ArticleEntity> {
        return await this.getRepository().findOne({ articleId: articleId });
    }

    async update (entity: ArticleEntity): Promise<UpdateResult> {
        return await this.getRepository().update({ articleId: entity.articleId }, entity);
    }

    async getArticleWithBadgeId (badgeId: string): Promise<ArticleEntity> {
        return await this.getRepository().createQueryBuilder()
            .where('find_in_set(:badgeId, badges) <> 0', { badgeId: badgeId })
            .orderBy('articleId', 'DESC')
            .getOne();
    }

    protected getRepository (): Repository<ArticleEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(ArticleEntity);
        return this.repository;
    }
}
