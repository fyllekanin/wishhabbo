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
    @Column()
    content: string;
    @Column()
    badges: string;
    @Column()
    room: string;
    @Column()
    difficulty: number;
    @Column()
    isApproved: boolean;

    getParsedBadges (): Array<string> {
        try {
            return JSON.parse(this.badges);
        } catch (e) {
            return [];
        }
    }

    static newBuilder (): ArticleEntityBuilder {
        return new ArticleEntityBuilder();
    }
}

class ArticleEntityBuilder {
    userId: number;
    title: string;
    content: string;
    badges: string;
    room: string;
    difficulty: number;
    isApproved: boolean;

    withUserId (userId: number): ArticleEntityBuilder {
        this.userId = userId;
        return this;
    }

    withTitle (title: string): ArticleEntityBuilder {
        this.title = title;
        return this;
    }

    withContent (content: string): ArticleEntityBuilder {
        this.content = content;
        return this;
    }

    withBadges (badges: Array<string>): ArticleEntityBuilder {
        this.badges = JSON.stringify(badges);
        return this;
    }

    withRoom (room: string): ArticleEntityBuilder {
        this.room = room;
        return this;
    }

    withDifficulty (difficulty: number): ArticleEntityBuilder {
        this.difficulty = difficulty;
        return this;
    }

    withIsApproved (isApproved: boolean): ArticleEntityBuilder {
        this.isApproved = isApproved;
        return this;
    }

    build (): ArticleEntity {
        const entity = new ArticleEntity();
        entity.userId = this.userId;
        entity.title = this.title;
        entity.content = this.content;
        entity.badges = this.badges;
        entity.difficulty = this.difficulty;
        entity.isApproved = this.isApproved;
        return entity;
    }
}
