import { ClassHelper, objectOf, primitiveOf } from '../../shared/helpers/class.helper';

export class StaffPermissions {
    @primitiveOf(Boolean)
    CAN_BOOK_RADIO: boolean;
    @primitiveOf(Boolean)
    CAN_BOOK_EVENTS: boolean;
    @primitiveOf(Boolean)
    CAN_UNBOOK_OTHERS_RADIO: boolean;
    @primitiveOf(Boolean)
    CAN_UNBOOK_OTHERS_EVENTS: boolean;
    @primitiveOf(Boolean)
    CAN_WRITE_ARTICLES: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_ARTICLES: boolean;
    @primitiveOf(Boolean)
    CAN_KICK_DJ_OFF_AIR: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_EVENT_TYPES: boolean;
    @primitiveOf(Boolean)
    CAN_UPLOAD_RESOURCES: boolean;

    constructor (source: Partial<StaffPermissions>) {
        ClassHelper.assign(this, source);
    }

    doHaveAnyPerm (): boolean {
        return Object.keys(this).some(key => this[key]);
    }
}

export class AdminPermissions {
    @primitiveOf(Boolean)
    CAN_MANAGE_GROUPS: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_USER_BASICS: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_USER_ADVANCED: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_USER_GROUPS: boolean;
    @primitiveOf(Boolean)
    CAN_SEE_LOGS: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_STAFF_LIST: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_RADIO_SETTINGS: boolean;
    @primitiveOf(Boolean)
    CAN_MANAGE_BBCODES: boolean;

    constructor (source: Partial<AdminPermissions>) {
        ClassHelper.assign(this, source);
    }

    doHaveAnyPerm (): boolean {
        return Object.keys(this).some(key => this[key]);
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
    adminPermissions: AdminPermissions = new AdminPermissions(null);
    @objectOf(StaffPermissions)
    staffPermissions: StaffPermissions = new StaffPermissions(null);

    @primitiveOf(Boolean)
    doHaveAdminPermissions: boolean;
    @primitiveOf(Boolean)
    doHaveStaffPermissions: boolean;

    constructor (source: Partial<AuthUser>) {
        ClassHelper.assign(this, source);
        this.doHaveAdminPermissions = this.adminPermissions.doHaveAnyPerm();
        this.doHaveStaffPermissions = this.staffPermissions.doHaveAnyPerm();
    }

}
