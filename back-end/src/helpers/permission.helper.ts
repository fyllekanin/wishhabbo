import { UserEntity } from '../persistance/entities/user/user.entity';
import { AdminPermissions, StaffPermissions } from '../rest-service-views/respond-views/user/auth-user.view';
import { Permissions } from '../constants/permissions.constant';
import { GroupEntity } from '../persistance/entities/group/group.entity';
import { StringKeyValue } from '../utilities/object.interface';
import { ServiceConfig } from '../utilities/internal.request';
import { UserGroupOrchestrator } from '../persistance/repositories/group/user-group.orchestrator';

export class PermissionHelper {

    static getConvertedStaffPermissionsToNumber (permissions: StaffPermissions): number {
        const casted = <StringKeyValue<boolean>><unknown>permissions;
        return Object.keys(permissions).reduce((value, key) => {
            if (casted[key]) {
                return value + Permissions.STAFF[key];
            }
            return value;
        }, 0);
    }

    static getConvertedAdminPermissionsToNumber (permissions: AdminPermissions): number {
        const casted = <StringKeyValue<boolean>><unknown>permissions;
        return Object.keys(permissions).reduce((value, key) => {
            if (casted[key]) {
                return value + Permissions.ADMIN[key];
            }
            return value;
        }, 0);
    }

    static getConvertedStaffPermissionsToUI (group: GroupEntity): StaffPermissions {
        const permissions: { [key: string]: boolean } = {};
        const keys = Object.keys(Permissions.STAFF);
        for (const key of keys) {
            permissions[key] = Boolean(group.staffPermissions & Permissions.STAFF[key]);
        }
        return <StaffPermissions><unknown>permissions;
    }

    static getConvertedAdminPermissionsToUI (group: GroupEntity): AdminPermissions {
        const permissions: { [key: string]: boolean } = {};
        const keys = Object.keys(Permissions.ADMIN);
        for (const key of keys) {
            permissions[key] = Boolean(group.adminPermissions & Permissions.ADMIN[key]);
        }
        return <AdminPermissions><unknown>permissions;
    }

    static async getConvertedStaffPermissionsForUser (user: UserEntity, serviceConfig: ServiceConfig): Promise<StaffPermissions> {
        const permissions: { [key: string]: boolean } = {};
        const keys = Object.keys(Permissions.STAFF);
        for (const key of keys) {
            permissions[key] = await UserGroupOrchestrator.doUserHaveStaffPermission(serviceConfig, user.userId, Permissions.STAFF[key]);
        }
        return <StaffPermissions><unknown>permissions;
    }

    static async getConvertedAdminPermissionsForUser (user: UserEntity, serviceConfig: ServiceConfig): Promise<AdminPermissions> {
        const permissions: { [key: string]: boolean } = {};
        const keys = Object.keys(Permissions.ADMIN);
        for (const key of keys) {
            permissions[key] = await UserGroupOrchestrator.doUserHaveAdminPermission(serviceConfig, user.userId, Permissions.ADMIN[key]);
        }
        return <AdminPermissions><unknown>permissions;
    }
}
