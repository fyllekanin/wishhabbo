export class SlimUserView {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;
    private readonly likes: number;
    private readonly updatedAt: number;

    constructor (builder: Builder) {
        if (!builder) {
            return;
        }
        this.userId = builder.userId;
        this.username = builder.username;
        this.habbo = builder.habbo;
        this.likes = builder.likes;
        this.updatedAt = builder.updatedAt;
    }

    getUserId (): number {
        return this.userId;
    }

    getUsername (): string {
        return this.username;
    }

    getHabbo (): string {
        return this.habbo;
    }

    getLikes (): number {
        return this.likes;
    }

    getUpdatedAt (): number {
        return this.updatedAt;
    }

    static of (user: SlimUserView): SlimUserView {
        if (!user) {
            return new SlimUserView(null);
        }
        return new Builder().withUserId(user.userId)
            .withUsername(user.username)
            .withHabbo(user.habbo)
            .build();
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    userId: number;
    username: string;
    habbo: string;
    likes: number;
    updatedAt: number;

    withUserId (userId: number): Builder {
        this.userId = userId;
        return this;
    }

    withUsername (username: string): Builder {
        this.username = username;
        return this;
    }

    withHabbo (habbo: string): Builder {
        this.habbo = habbo;
        return this;
    }

    withLikes (likes: number): Builder {
        this.likes = likes;
        return this;
    }

    withUpdatedAt (updatedAt: number): Builder {
        this.updatedAt = updatedAt;
        return this;
    }

    build (): SlimUserView {
        return new SlimUserView(this);
    }
}
