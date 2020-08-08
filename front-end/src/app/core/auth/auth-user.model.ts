import { ClassHelper, objectOf, primitiveOf } from '../../shared/helpers/class.helper';

export class StaffPermissions {
    @primitiveOf(Boolean)
    canBookRadio: boolean;
    @primitiveOf(Boolean)
    canBookEvents: boolean;
    @primitiveOf(Boolean)
    canUnbookOthersRadio: boolean;
    @primitiveOf(Boolean)
    canUnbookOthersEvents: boolean;
    @primitiveOf(Boolean)
    canWriteArticles: boolean;
    @primitiveOf(Boolean)
    canApproveArticles: boolean;
    @primitiveOf(Boolean)
    canKickDjOffAir: boolean;

    constructor (source: Partial<StaffPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class AdminPermissions {
    @primitiveOf(Boolean)
    canManageGroups: boolean;
    @primitiveOf(Boolean)
    canManageUserBasics: boolean;
    @primitiveOf(Boolean)
    canManageUserGroups: boolean;
    @primitiveOf(Boolean)
    canManageWebsiteSettings: boolean;
    @primitiveOf(Boolean)
    canSeeLogs: boolean;
    @primitiveOf(Boolean)
    canUploadResources: boolean;

    constructor (source: Partial<AdminPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class AuthUser {
    @primitiveOf(Number)
    userId: number;
    @primitiveOf(String)
    username: string;
    @primitiveOf(String)
    habbo: string;
    @primitiveOf(String)
    accessToken: string;
    @primitiveOf(String)
    refreshToken: string;
    @objectOf(AdminPermissions)
    adminPermissions: AdminPermissions;
    @objectOf(StaffPermissions)
    staffPermissions: StaffPermissions;

    constructor (source: Partial<AuthUser>) {
        ClassHelper.assign(this, source);
    }
}
