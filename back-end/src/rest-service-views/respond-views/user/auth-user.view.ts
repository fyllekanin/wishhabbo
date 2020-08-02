export class AuthUserView {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;
    private readonly accessToken: string;
    private readonly refreshToken: string;

    constructor (builder: AuthUserViewBuilder) {
        this.userId = builder.userId;
        this.username = builder.username;
        this.habbo = builder.habbo;
        this.accessToken = builder.accessToken;
        this.refreshToken = builder.refreshToken;
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

    getAccessToken (): string {
        return this.accessToken;
    }

    getRefreshToken (): string {
        return this.refreshToken;
    }

    static newBuilder (): AuthUserViewBuilder {
        return new AuthUserViewBuilder();
    }
}

class AuthUserViewBuilder {
    userId: number;
    username: string;
    habbo: string;
    accessToken: string;
    refreshToken: string;

    withUserId (userId: number): AuthUserViewBuilder {
        this.userId = userId;
        return this;
    }

    withUsername (username: string): AuthUserViewBuilder {
        this.username = username;
        return this;
    }

    withHabbo (habbo: string): AuthUserViewBuilder {
        this.habbo = habbo;
        return this;
    }

    withAccessToken (accessToken: string): AuthUserViewBuilder {
        this.accessToken = accessToken;
        return this;
    }

    withRefreshToken (refreshToken: string): AuthUserViewBuilder {
        this.refreshToken = refreshToken;
        return this;
    }

    build (): AuthUserView {
        return new AuthUserView(this);
    }
}
