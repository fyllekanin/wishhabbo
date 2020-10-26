import { getConnection, Repository } from 'typeorm';
import { BaseRepository } from '../../base.repository';
import { ArticleCommentEntity } from '../../../entities/staff/media/article-comment.entity';

export class ArticleCommentRepository extends BaseRepository<ArticleCommentEntity> {
    protected repository: Repository<ArticleCommentEntity>;

    protected getRepository (): Repository<ArticleCommentEntity> {
        if (this.repository) {
            return this.repository;
        }
        this.repository = getConnection().getRepository(ArticleCommentEntity);
        return this.repository;
    }
}
