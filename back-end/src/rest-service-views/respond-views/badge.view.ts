export class BadgeView {
    private readonly habboBadgeId: number;
    private readonly badgeId: string;
    private readonly description: string;
    private readonly articleId: number;
    private readonly isCompleted: boolean;
    private readonly createdAt: number;

    constructor (builder: Builder) {
        this.habboBadgeId = builder.habboBadgeId;
        this.badgeId = builder.badgeId;
        this.description = builder.description;
        this.articleId = builder.articleId;
        this.isCompleted = builder.isCompleted;
        this.createdAt = builder.createdAt;
    }

    getHabboBadgeId (): number {
        return this.habboBadgeId;
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

    getIsCompleted (): boolean {
        return this.isCompleted;
    }

    getCreatedAt (): number {
        return this.createdAt;
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    habboBadgeId: number;
    badgeId: string;
    description: string;
    articleId: number;
    isCompleted: boolean;
    createdAt: number;

    withHabboBadgeId (habboBadgeId: number): Builder {
        this.habboBadgeId = habboBadgeId;
        return this;
    }

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

    withIsCompleted (isCompleted: boolean): Builder {
        this.isCompleted = isCompleted;
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
