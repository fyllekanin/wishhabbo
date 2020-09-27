import { SlimUserView } from '../../../two-way/slim-user.view';

export class ArticleView {
    articleId: number;
    user: SlimUserView;
    title: string;
    parsedContent: string;
    content: string;
    badges: Array<string>;
    room: string;
    roomOwner: string;
    difficulty: number;
    type: number;
    isApproved: boolean;
    isAvailable: boolean;
    isPaid: boolean;

    static newBuilder (): ArticleViewBuilder {
        return new ArticleViewBuilder();
    }
}

class ArticleViewBuilder {
    articleId: number;
    user: SlimUserView;
    title: string;
    parsedContent: string;
    content: string;
    badges: Array<string>;
    room: string;
    roomOwner: string;
    difficulty: number;
    type: number;
    isApproved: boolean;
    isAvailable: boolean;
    isPaid: boolean;

    withArticleId (articleId: number): ArticleViewBuilder {
        this.articleId = articleId;
        return this;
    }

    withUser (user: SlimUserView): ArticleViewBuilder {
        this.user = user;
        return this;
    }

    withTitle (title: string): ArticleViewBuilder {
        this.title = title;
        return this;
    }

    withContent (content: string): ArticleViewBuilder {
        this.content = content;
        return this;
    }

    withParsedContent(parsedContent: string): ArticleViewBuilder {
        this.parsedContent = parsedContent;
        return this;
    }

    withBadges (badges: Array<string>): ArticleViewBuilder {
        this.badges = badges;
        return this;
    }

    withRoom (room: string): ArticleViewBuilder {
        this.room = room;
        return this;
    }

    withRoomOwner (roomOwner: string): ArticleViewBuilder {
        this.roomOwner = roomOwner;
        return this;
    }

    withDifficulty (difficulty: number): ArticleViewBuilder {
        this.difficulty = difficulty;
        return this;
    }

    withType (type: number): ArticleViewBuilder {
        this.type = type;
        return this;
    }

    withIsApproved (isApproved: boolean): ArticleViewBuilder {
        this.isApproved = isApproved;
        return this;
    }

    withIsAvailable(isAvailable: boolean): ArticleViewBuilder {
        this.isAvailable = isAvailable;
        return this;
    }

    withIsPaid(isPaid: boolean): ArticleViewBuilder {
        this.isPaid = isPaid;
        return this;
    }

    build (): ArticleView {
        const entity = new ArticleView();
        entity.articleId = this.articleId;
        entity.user = this.user;
        entity.title = this.title;
        entity.parsedContent = this.parsedContent;
        entity.content = this.content;
        entity.badges = this.badges;
        entity.room = this.room;
        entity.roomOwner = this.roomOwner;
        entity.difficulty = this.difficulty;
        entity.type = this.type;
        entity.isApproved = this.isApproved;
        entity.isAvailable = this.isAvailable;
        entity.isPaid = this.isPaid;
        return entity;
    }
}
