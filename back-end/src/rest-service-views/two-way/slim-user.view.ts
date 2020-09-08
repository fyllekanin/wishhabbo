export class SlimUserView {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;
    private readonly updatedAt: number;

    constructor (builder: SlimUserViewBuilder) {
        if (!builder) {
            return;
        }
        this.userId = builder.userId;
        this.username = builder.username;
        this.habbo = builder.habbo;
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

    getUpdatedAt (): number {
        return this.updatedAt;
    }

    static of (user: SlimUserView): SlimUserView {
        if (!user) {
            return new SlimUserView(null);
        }
        const builder = new SlimUserViewBuilder();
        return builder.withUserId(user.userId)
            .withUsername(user.username)
            .withHabbo(user.habbo)
            .build();
    }

    static newBuilder (): SlimUserViewBuilder {
        return new SlimUserViewBuilder();
    }
}

class SlimUserViewBuilder {
    userId: number;
    username: string;
    habbo: string;
    updatedAt: number;

    withUserId (userId: number): SlimUserViewBuilder {
        this.userId = userId;
        return this;
    }

    withUsername (username: string): SlimUserViewBuilder {
        this.username = username;
        return this;
    }

    withHabbo (habbo: string): SlimUserViewBuilder {
        this.habbo = habbo;
        return this;
    }

    withUpdatedAt (updatedAt: number): SlimUserViewBuilder {
        this.updatedAt = updatedAt;
        return this;
    }

    build (): SlimUserView {
        return new SlimUserView(this);
    }
}
