export class SlimUserView {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;

    constructor (builder: SlimUserViewBuilder) {
        this.userId = builder.userId;
        this.username = builder.username;
        this.habbo = builder.habbo;
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

    static newBuilder (): SlimUserViewBuilder {
        return new SlimUserViewBuilder();
    }
}

class SlimUserViewBuilder {
    userId: number;
    username: string;
    habbo: string;

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

    build (): SlimUserView {
        return new SlimUserView(this);
    }
}
