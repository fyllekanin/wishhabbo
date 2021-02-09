import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../../created-updated-at.entity';

interface IArticleCommentEntity {
    articleCommentId: number;
    userId: number;
    articleId: number;
    content: string;
    updatedAt: number;
}

@Entity('article_comments')
export class ArticleCommentEntity extends CreatedUpdatedAtEntity implements IArticleCommentEntity {
    @PrimaryGeneratedColumn()
    articleCommentId: number;
    @Column()
    userId: number;
    @Column()
    articleId: number;
    @Column({type: 'longtext'})
    content: string;

    constructor(builder: IArticleCommentEntity) {
        super();
        if (!builder) {
            return;
        }

        this.articleCommentId = builder.articleCommentId;
        this.articleId = builder.articleId;
        this.userId = builder.userId;
        this.content = builder.content;
    }

    newBuilderFromCurrent(): Builder {
        return new Builder(this);
    }

    static newBuilder(): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IArticleCommentEntity = {
        articleCommentId: undefined,
        articleId: undefined,
        userId: undefined,
        content: undefined,
        updatedAt: undefined
    };

    constructor(entity?: ArticleCommentEntity) {
        Object.assign(this.myData, entity);
    }

    withArticleCommentId(articleCommentId: number): Builder {
        this.myData.articleCommentId = articleCommentId;
        return this;
    }

    withArticleId(articleId: number): Builder {
        this.myData.articleId = articleId;
        return this;
    }

    withUserId(userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withContent(content: string): Builder {
        this.myData.content = content;
        return this;
    }

    withUpdatedAt(updatedAt: number): Builder {
        this.myData.updatedAt = updatedAt;
        return this;
    }

    build(): ArticleCommentEntity {
        return new ArticleCommentEntity(this.myData);
    }
}
