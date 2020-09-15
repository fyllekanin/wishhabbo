import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../../created-updated-at.entity';

interface IArticleEntity {
    articleId: number;
    userId: number;
    title: string;
    content: string;
    badges: string;
    room: string;
    roomOwner: string;
    difficulty: number;
    type: number;
    isApproved: boolean;
}

@Entity('articles')
export class ArticleEntity extends CreatedUpdatedAtEntity implements IArticleEntity {
    @PrimaryGeneratedColumn()
    articleId: number;
    @Column()
    userId: number;
    @Column({ unique: true })
    title: string;
    @Column({ type: 'longtext' })
    @Index({ fulltext: true })
    content: string;
    @Column()
    @Index()
    badges: string;
    @Column()
    room: string;
    @Column()
    @Index()
    roomOwner: string;
    @Column()
    difficulty: number;
    @Column()
    @Index()
    type: number;
    @Column()
    @Index()
    isApproved: boolean;

    constructor (builder: IArticleEntity) {
        super();
        if (!builder) {
            return;
        }

        this.articleId = builder.articleId;
        this.userId = builder.userId;
        this.title = builder.title;
        this.content = builder.content;
        this.badges = builder.badges;
        this.room = builder.room;
        this.roomOwner = builder.roomOwner;
        this.difficulty = builder.difficulty;
        this.type = builder.type;
        this.isApproved = builder.isApproved;
    }

    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IArticleEntity = {
        articleId: undefined,
        userId: undefined,
        title: undefined,
        content: undefined,
        badges: undefined,
        room: undefined,
        roomOwner: undefined,
        difficulty: undefined,
        type: undefined,
        isApproved: undefined
    };

    constructor (entity?: ArticleEntity) {
        Object.assign(this, entity);
    }

    withArticleId (articleId: number): Builder {
        this.myData.articleId = articleId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withTitle (title: string): Builder {
        this.myData.title = title;
        return this;
    }

    withContent (content: string): Builder {
        this.myData.content = content;
        return this;
    }

    withBadges (badges: Array<string>): Builder {
        this.myData.badges = JSON.stringify(badges);
        return this;
    }

    withRoom (room: string): Builder {
        this.myData.room = room;
        return this;
    }

    withRoomOwner (roomOwner: string): Builder {
        this.myData.roomOwner = roomOwner;
        return this;
    }

    withDifficulty (difficulty: number): Builder {
        this.myData.difficulty = difficulty;
        return this;
    }

    withType (type: number): Builder {
        this.myData.type = type;
        return this;
    }

    withIsApproved (isApproved: boolean): Builder {
        this.myData.isApproved = isApproved;
        return this;
    }

    build (): ArticleEntity {
        return new ArticleEntity(this.myData);
    }
}
