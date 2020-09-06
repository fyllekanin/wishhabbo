export interface StaffPermissions {
    CAN_BOOK_RADIO: boolean;
    CAN_BOOK_EVENTS: boolean;
    CAN_UNBOOK_OTHERS_RADIO: boolean;
    CAN_UNBOOK_OTHERS_EVENTS: boolean;
    CAN_WRITE_ARTICLES: boolean;
    CAN_MANAGE_ARTICLES: boolean;
    CAN_KICK_DJ_OFF_AIR: boolean;
    CAN_MANAGE_EVENT_TYPES: boolean;
    CAN_UPLOAD_RESOURCES: boolean;
}

export interface AdminPermissions {
    CAN_MANAGE_GROUPS: boolean;
    CAN_MANAGE_USER_BASICS: boolean;
    CAN_MANAGE_USER_ADVANCED: boolean,
    CAN_MANAGE_USER_GROUPS: boolean;
    CAN_MANAGE_WEBSITE_SETTINGS: boolean;
    CAN_SEE_LOGS: boolean;
}

export class AuthUserView {
    private readonly userId: number;
    private readonly username: string;
    private readonly habbo: string;
    private readonly accessToken: string;
    private readonly refreshToken: string;
    private readonly staffPermissions: StaffPermissions;
    private readonly adminPermissions: AdminPermissions;

    constructor (builder: AuthUserViewBuilder) {
        this.userId = builder.userId;
        this.username = builder.username;
        this.habbo = builder.habbo;
        this.accessToken = builder.accessToken;
        this.refreshToken = builder.refreshToken;
        this.staffPermissions = builder.staffPermissions;
        this.adminPermissions = builder.adminPermissions;
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

    getStaffPermissions (): StaffPermissions {
        return { ...this.staffPermissions };
    }

    getAdminPermissions (): AdminPermissions {
        return { ...this.adminPermissions };
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
    staffPermissions: StaffPermissions;
    adminPermissions: AdminPermissions;

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

    withStaffPermissions (staffPermissions: StaffPermissions): AuthUserViewBuilder {
        this.staffPermissions = staffPermissions;
        return this;
    }

    withAdminPermissions (adminPermissions: AdminPermissions): AuthUserViewBuilder {
        this.adminPermissions = adminPermissions;
        return this;
    }

    build (): AuthUserView {
        return new AuthUserView(this);
    }
}
