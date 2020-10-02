export class BadgeView {
    private readonly badgeId: string;
    private readonly description: string;
    private readonly articleId: number;
    private readonly createdAt: number;

    constructor (builder: Builder) {
        this.badgeId = builder.badgeId;
        this.description = builder.description;
        this.articleId = builder.articleId;
        this.createdAt = builder.createdAt;
    }

    getBadgeId (): string {
        return this.badgeId;
    }

    getDescription (): string {
        return this.description;
    }

    getArticleId (): number {
        return this.articleId;
    }

    getCreatedAt (): number {
        return this.createdAt;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    badgeId: string;
    description: string;
    articleId: number;
    createdAt: number;

    withBadgeId (badgeId: string): Builder {
        this.badgeId = badgeId;
        return this;
    }

    withDescription (description: string): Builder {
        this.description = description;
        return this;
    }

    withArticleId (articleId: number): Builder {
        this.articleId = articleId;
        return this;
    }

    withCreatedAt (createdAt: number): Builder {
        this.createdAt = createdAt;
        return this;
    }

    build (): BadgeView {
        return new BadgeView(this);
    }
}
