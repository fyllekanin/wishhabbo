export class SlimUserView {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;
    private readonly likes: number;
    private readonly updatedAt: number;
    private readonly nameColors: Array<string>;

    constructor (builder: Builder) {
        if (!builder) {
            return;
        }
        this.userId = builder.userId;
        this.username = builder.username;
        this.habbo = builder.habbo;
        this.likes = builder.likes;
        this.updatedAt = builder.updatedAt;
        this.nameColors = builder.nameColors ? [ ...builder.nameColors ] : [];
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

    getNameColors (): Array<string> {
        return [ ...this.nameColors ];
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
    nameColors: Array<string>;

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

    withNameColors (nameColors: Array<string>): Builder {
        this.nameColors = [ ...nameColors ];
        return this;
    }

    build (): SlimUserView {
        return new SlimUserView(this);
    }
}
