import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../../created-updated-at.entity';

@Entity('articles')
export class ArticleEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    articleId: number;
    @Column()
    userId: number;
    @Column()
    title: string;
    @Column({ type: 'longtext' })
    content: string;
    @Column()
    badges: string;
    @Column()
    room: string;
    @Column()
    difficulty: number;
    @Column()
    type: number;
    @Column()
    isApproved: boolean;

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    articleId: number;
    userId: number;
    title: string;
    content: string;
    badges: string;
    room: string;
    difficulty: number;
    type: number;
    isApproved: boolean;

    constructor (entity?: ArticleEntity) {
        Object.assign(this, entity);
    }

    withArticleId (articleId: number): Builder {
        this.articleId = articleId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.userId = userId;
        return this;
    }

    withTitle (title: string): Builder {
        this.title = title;
        return this;
    }

    withContent (content: string): Builder {
        this.content = content;
        return this;
    }

    withBadges (badges: Array<string>): Builder {
        this.badges = JSON.stringify(badges);
        return this;
    }

    withRoom (room: string): Builder {
        this.room = room;
        return this;
    }

    withDifficulty (difficulty: number): Builder {
        this.difficulty = difficulty;
        return this;
    }

    withType (type: number): Builder {
        this.type = type;
        return this;
    }

    withIsApproved (isApproved: boolean): Builder {
        this.isApproved = isApproved;
        return this;
    }

    build (): ArticleEntity {
        const entity = new ArticleEntity();
        entity.articleId = this.articleId;
        entity.userId = this.userId;
        entity.title = this.title;
        entity.content = this.content;
        entity.badges = this.badges;
        entity.room = this.room;
        entity.difficulty = this.difficulty;
        entity.type = this.type;
        entity.isApproved = this.isApproved;
        return entity;
    }
}
